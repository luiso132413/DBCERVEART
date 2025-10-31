// Archivo: app.js
// Descripción: Script principal del frontend. Maneja los KPIs, el registro de movimientos
// y la sincronización automática entre pestañas con BroadcastChannel.

const API = '/api';

// Accesos rápidos a elementos del DOM
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];

// Muestra un pequeño aviso visual (toast) en la pantalla
function toast(msg, ok=true){
  const el = $('#toast');
  el.textContent = msg;
  el.style.background = ok ? '#244a2a' : '#5a2222';
  el.hidden = false;
  setTimeout(()=> el.hidden = true, 2500);
}

// Wrapper para fetch con manejo de errores y respuesta en JSON
async function fetchJSON(url, opt={}) {
  const res = await fetch(url, { headers:{'Content-Type':'application/json'}, ...opt });
  const data = await res.json().catch(()=> ({}));
  if(!res.ok){ throw new Error(data?.error || data?.errors?.join(', ') || res.statusText); }
  return data;
}

// Carga los KPIs principales del dashboard (lotes, producción, desperdicio)
async function loadKPIs(){
  const lotes = await fetchJSON(`${API}/lotes`);
  $('#kpi-lotes').textContent = (lotes?.length ?? 0);

  // Cálculo de totales de producción y desperdicio
  const prodTotal = (lotes||[]).reduce((acc,l)=> acc + (Number(l.volumen_producido_litros)||0),0);
  $('#kpi-prod').textContent = prodTotal.toFixed(1);

  const desp = await fetchJSON(`${API}/desperdicios`);
  const despTotal = (desp||[]).reduce((a,d)=> a + (Number(d.cantidad_litros)||0),0);
  $('#kpi-desp').textContent = despTotal.toFixed(1);

  // Porcentaje de desperdicio
  const pct = prodTotal > 0 ? (despTotal/prodTotal*100) : 0;
  $('#kpi-porc').textContent = pct.toFixed(2) + '%';
}

// Carga los últimos movimientos registrados (limit 5)
async function loadUltimosMovs(){
  const movs = await fetchJSON(`${API}/movimientos?limit=5`);
  const tbody = $('#tbl-movs tbody');
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

<<<<<<< HEAD
// Refresca todos los datos del dashboard
async function refreshAll(){
  try{
    await Promise.all([loadKPIs(), loadUltimosMovs()]);
  }catch(err){
    console.error(err);
    toast('Error refrescando datos', false);
  }
}

// Canal para sincronizar actualizaciones entre pestañas
const bc = new BroadcastChannel('dbc-actualizaciones');
bc.addEventListener('message', (ev) => {
  if (ev?.data === 'refresh') {
    refreshAll();
  }
});

// Permite avisar a otras páginas cuando se crea o elimina algo
window.DBC_NOTIFY_UPDATE = () => {
  try { bc.postMessage('refresh'); } catch {}
};

// Envía un nuevo movimiento al backend
=======
>>>>>>> parent of e032184 (final)
async function submitMovimiento(e){
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = Object.fromEntries(fd.entries());

  // Convierte los campos que deben ser numéricos
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
<<<<<<< HEAD
    await loadKPIs(); // actualiza KPIs tras registrar
    if (window.DBC_NOTIFY_UPDATE) window.DBC_NOTIFY_UPDATE(); // avisa a otras pestañas
=======
>>>>>>> parent of e032184 (final)
  }catch(err){
    toast(err.message || 'Error al registrar', false);
    console.error(err);
  }
}

// Al cargar la página, inicializa eventos y actualiza datos
document.addEventListener('DOMContentLoaded', async ()=>{
  if($('#kpi-lotes')){ // comprobación para no ejecutar en todas las páginas
    $('#btn-refrescar')?.addEventListener('click', ()=> loadUltimosMovs());
    $('#form-mov')?.addEventListener('submit', submitMovimiento);
    try{
      await Promise.all([loadKPIs(), loadUltimosMovs()]);
<<<<<<< HEAD
    }catch(err){
      console.error(err);
      toast('Error cargando datos', false);
    }
    // Refresco automático cada 15 segundos
    setInterval(refreshAll, 15000);
=======
    }catch(err){ console.error(err); toast('Error cargando datos', false); }
>>>>>>> parent of e032184 (final)
  }
});
