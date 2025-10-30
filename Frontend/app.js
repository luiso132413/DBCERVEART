const API = '/api';

const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

function toast(msg, ok=true){
  const el = $('#toast');
  if (!el) return; // por si no existe en la página
  el.textContent = msg; el.style.background = ok ? '#244a2a' : '#5a2222';
  el.hidden = false; setTimeout(()=> el.hidden = true, 2500);
}

async function fetchJSON(url, opt={}){
  const res = await fetch(url, { headers:{'Content-Type':'application/json'}, ...opt });
  const data = await res.json().catch(()=> ({}));
  if(!res.ok){ throw new Error(data?.error || data?.errors?.join(', ') || res.statusText); }
  return data;
}

/* =========================
   KPIs (TU LÓGICA ORIGINAL)
========================= */
async function loadKPIs(){
  // Lotes activos
  const lotes = await fetchJSON(`${API}/lotes`);
  $('#kpi-lotes')?.textContent = (lotes?.length ?? 0);

  // Producción y desperdicio (simple: suma total)
  const prodTotal = (lotes||[]).reduce((acc,l)=> acc + (Number(l.volumen_producido_litros)||0),0);
  $('#kpi-prod')?.textContent = prodTotal.toFixed(1);

  const desp = await fetchJSON(`${API}/desperdicios`);
  const despTotal = (desp||[]).reduce((a,d)=> a + (Number(d.cantidad_litros)||0),0);
  $('#kpi-desp')?.textContent = despTotal.toFixed(1);

  const pct = prodTotal > 0 ? (despTotal/prodTotal*100) : 0;
  $('#kpi-porc')?.textContent = pct.toFixed(2) + '%';
}

/* =========================
   Últimos Movimientos (TU LÓGICA ORIGINAL)
========================= */
async function loadUltimosMovs(){
  const movs = await fetchJSON(`${API}/movimientos?limit=5`);
  const tbody = $('#tbl-movs tbody'); 
  if (!tbody) return; // por si esta tabla no existe en el Dashboard
  tbody.innerHTML = '';
  (movs?.data || movs || []).forEach(m=>{
    const tr = document.createElement('tr');
    const fecha = (m.fecha||'').toString().slice(0,10);
    tr.innerHTML = `
      <td>${fecha}</td>
      <td>${m.tipo}</td>
      <td>${m.EnvaseTipo?.nombre || m.envase_tipo_id || ''}</td>
      <td>${m.Lote?.codigo || m.lote_id || ''}</td>
      <td>${m.cantidad}</td>
      <td>${m.detalle || ''}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* =========================
   NUEVO: POBLAR TABLAS DEL DASHBOARD
   (no altera tu lógica; solo añade)
========================= */
async function loadEstilosLista(){
  const ul = $('#lista-estilos');
  if (!ul) return;
  const estilos = await fetchJSON(`${API}/estilos`);
  ul.innerHTML = '';
  (estilos || []).forEach(e => {
    const li = document.createElement('li');
    li.textContent = e.nombre || e.estilo || `Estilo ${e.estilo_id || ''}`;
    ul.appendChild(li);
  });
}

async function loadEnvasesLista(){
  const ul = $('#lista-envases');
  if (!ul) return;
  // intenta /envase-tipos; si no existe, cae a /envases
  const envases = await fetchJSON(`${API}/envase-tipos`).catch(()=> fetchJSON(`${API}/envases`));
  ul.innerHTML = '';
  (envases || []).forEach(ev => {
    const li = document.createElement('li');
    li.textContent = ev.nombre || ev.tipo || ev.descripcion || `Envase ${ev.envase_tipo_id || ''}`;
    ul.appendChild(li);
  });
}

async function loadLotesResumen(){
  const tb = $('#tbl-lotes-resumen tbody');
  if (!tb) return;
  const [lotes, estilos] = await Promise.all([
    fetchJSON(`${API}/lotes`),
    fetchJSON(`${API}/estilos`)
  ]);
  tb.innerHTML = '';
  // ordenar por fecha_inicio descendente cuando exista
  const lotesOrd = [...(lotes||[])].sort((a,b)=>{
    const da = a.fecha_inicio ? new Date(a.fecha_inicio).getTime() : 0;
    const db = b.fecha_inicio ? new Date(b.fecha_inicio).getTime() : 0;
    return db - da;
  });
  lotesOrd.slice(0, 12).forEach(l=>{
    const tr = document.createElement('tr');
    const codigo = l.codigo || `L${l.lote_id}`;
    const estiloNombre = l.Estilo?.nombre
      || l.estilo_nombre
      || (()=> {
          const e = (estilos||[]).find(x => x.estilo_id === l.estilo_id);
          return e ? e.nombre : '—';
        })();
    tr.innerHTML = `<td>${codigo}</td><td>${estiloNombre}</td>`;
    tb.appendChild(tr);
  });
}

async function loadDesperdiciosTablaYTotal(){
  const tb = $('#tbl-desp-lotes tbody');
  const totalEl = $('#total-desp');
  if (!tb && !totalEl) return;

  const [desps, lotes, estilos] = await Promise.all([
    fetchJSON(`${API}/desperdicios`),
    fetchJSON(`${API}/lotes`),
    fetchJSON(`${API}/estilos`)
  ]);

  if (tb) {
    tb.innerHTML = '';
    (desps||[])
      .sort((a,b)=>{
        const da = a.fecha ? new Date(a.fecha).getTime() : 0;
        const db = b.fecha ? new Date(b.fecha).getTime() : 0;
        return db - da;
      })
      .slice(0, 20)
      .forEach(d=>{
        const lRelacionado = (lotes||[]).find(x => x.lote_id === d.lote_id) || d.Lote || {};
        const codigo = d.lote_codigo || lRelacionado.codigo || (lRelacionado.lote_id ? `L${lRelacionado.lote_id}` : '—');
        const eRelacionado = (estilos||[]).find(x => x.estilo_id === lRelacionado.estilo_id) || d.Estilo || {};
        const estiloNombre = d.estilo_nombre || eRelacionado?.nombre || '—';
        const litros = Number(d.cantidad_litros ?? d.litros ?? d.volumen_litros) || 0;
        const fecha = d.fecha ? String(d.fecha).slice(0,10) : '—';
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${codigo}</td><td>${estiloNombre}</td><td>${litros.toFixed(1)}</td><td>${fecha}</td>`;
        tb.appendChild(tr);
      });
  }

  if (totalEl) {
    const total = (desps||[]).reduce((acc,d)=> acc + (Number(d.cantidad_litros ?? d.litros ?? d.volumen_litros) || 0), 0);
    totalEl.textContent = `${total.toFixed(1)} L`;
  }
}

/* =========================
   NUEVO: refrescar TODO (KPIs + tablas)
========================= */
async function refreshAll(){
  try{
    await Promise.all([
      loadKPIs(),
      loadUltimosMovs().catch(()=>{}), // no rompe si la tabla no existe
      loadEstilosLista().catch(()=>{}),
      loadEnvasesLista().catch(()=>{}),
      loadLotesResumen().catch(()=>{}),
      loadDesperdiciosTablaYTotal().catch(()=>{})
    ]);
  }catch(err){
    console.error(err);
    toast('Error refrescando datos', false);
  }
}

/* =========================
   NUEVO: BroadcastChannel (refresco instantáneo)
========================= */
let bc;
try {
  bc = new BroadcastChannel('dbc-actualizaciones');
  bc.addEventListener('message', (ev) => {
    if (ev?.data === 'refresh') refreshAll();
  });
  // utilidad global para que OTRAS PÁGINAS avisen tras POST/PUT/DELETE
  window.DBC_NOTIFY_UPDATE = () => { try { bc.postMessage('refresh'); } catch {} };
} catch { /* entornos sin soporte */ }

/* =========================
   SUBMIT Movimiento (TU LÓGICA, con 2 líneas extra)
========================= */
async function submitMovimiento(e){
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = Object.fromEntries(fd.entries());
  // convierte numéricos
  if(payload.envase_tipo_id) payload.envase_tipo_id = Number(payload.envase_tipo_id);
  if(payload.lote_id) payload.lote_id = Number(payload.lote_id);
  payload.cantidad = Number(payload.cantidad);

  try{
    await fetchJSON(`${API}/movimientos`, {
      method:'POST',
      body: JSON.stringify(payload)
    });
    toast('Movimiento registrado');
    e.target.reset();
    await loadUltimosMovs();

    // === NUEVO: actualiza KPIs y tablas en esta pestaña ===
    await refreshAll();

    // === NUEVO: avisa a otras páginas para que refresquen ===
    if (window.DBC_NOTIFY_UPDATE) window.DBC_NOTIFY_UPDATE();

  }catch(err){
    toast(err.message || 'Error al registrar', false);
    console.error(err);
  }
}

/* =========================
   Ready (TU LÓGICA, con llamadas extra)
========================= */
document.addEventListener('DOMContentLoaded', async ()=>{
  if($('#kpi-lotes')){ // estamos en Index
    $('#btn-refrescar')?.addEventListener('click', ()=> loadUltimosMovs());
    $('#form-mov')?.addEventListener('submit', submitMovimiento);
    try{
      // tu carga inicial original
      await Promise.all([loadKPIs(), loadUltimosMovs()]);
      // NUEVO: llenar tablas del dashboard en la carga inicial
      await Promise.all([
        loadEstilosLista(),
        loadEnvasesLista(),
        loadLotesResumen(),
        loadDesperdiciosTablaYTotal()
      ]);
    }catch(err){ 
      console.error(err); 
      toast('Error cargando datos', false); 
    }

    // ===== NUEVO: polling suave cada 15s =====
    setInterval(refreshAll, 15000);
  }
});
