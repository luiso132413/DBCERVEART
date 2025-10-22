// ========= CONFIG =========
const $ = (sel, root=document) => root.querySelector(sel);
const $all = (sel, root=document) => [...root.querySelectorAll(sel)];

const LS = { API_BASE: "cervezart.apiBase" };
const DEFAULT_API_BASE = "http://localhost:8081/api";

// Normaliza la URL base (si olvidas /api, lo agrega)
const normBase = (u) => {
  if (!u) return DEFAULT_API_BASE;
  const clean = u.replace(/\/+$/,"");
  return clean.endsWith("/api") ? clean : `${clean}/api`;
};

// Inputs topbar
const apiBaseInput = $("#apiBase");
const mockToggle = $("#mockToggle");
const refreshBtn = $("#refreshBtn");

// Estado
let API_BASE = normBase(localStorage.getItem(LS.API_BASE) || DEFAULT_API_BASE);

// ====== Helpers de chart ======
const charts = {};
function wrapChart(id){
  const cvs = document.getElementById(id);
  if (!cvs) return;
  const parent = cvs.parentElement;
  if (!parent.classList.contains("chart-wrap")) {
    const w = document.createElement("div");
    w.className = "chart-wrap";
    parent.replaceChild(w, cvs);
    w.appendChild(cvs);
  }
}
function drawChart(id, config){
  wrapChart(id);
  charts[id]?.destroy?.();
  charts[id] = new Chart(document.getElementById(id).getContext("2d"), config);
}

// Init topbar
function initTopbar(){
  apiBaseInput.value = API_BASE;
  apiBaseInput.addEventListener("change", () => {
    API_BASE = normBase(apiBaseInput.value.trim() || DEFAULT_API_BASE);
    localStorage.setItem(LS.API_BASE, API_BASE);
    init();
  });

  if (mockToggle) {
    mockToggle.checked = false;
    mockToggle.disabled = true;
    mockToggle.title = "Deshabilitado: siempre API real";
  }

  refreshBtn?.addEventListener("click", () => init());
}

// ========= FETCH WRAPPER =========
async function api(path, opt = {}){
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, { headers: { "Content-Type":"application/json" }, ...opt });
  if(!res.ok){
    const text = await res.text().catch(()=> "");
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${text}`);
  }
  return res.status === 204 ? null : res.json();
}

// ========= UI HELPERS =========
const ui = {
  openDialog: (id)=> document.getElementById(id).showModal(),
  closeDialog: (id)=> document.getElementById(id).close(),
  setActive(view){
    $all(".navlink").forEach(a => a.classList.toggle("bg-slate-900", a.dataset.view===view));
    $all("[id^='view-']").forEach(v => v.classList.add("hidden"));
    document.getElementById(`view-${view}`).classList.remove("hidden");
  },
  fmtDate: (d)=> d ? new Date(d).toISOString().slice(0,10) : "",
  err: (e)=> { console.error(e); alert(e.message || "Error"); }
};

// ========= DASHBOARD =========
async function renderDashboard(){
  try{
    const [lotes, desperdicios, inventario] = await Promise.all([
      api("/lotes"),
      api("/desperdicios"),
      api("/inventario-envases"),
    ]);

    const litros = (lotes||[]).reduce((s,x)=> s + (+x.litros_producidos || 0), 0);
    const litrosDesp = (desperdicios||[]).reduce((s,x)=> s + (+x.litros || 0), 0);
    const rendimiento = litros ? (((litros - litrosDesp)/litros)*100).toFixed(1)+"%" : "0%";
    const stock = (inventario||[]).reduce((s,x)=> s + (+x.cantidad_envase || +x.stock_actual || 0), 0);

    $("#kpiLitros").textContent = litros;
    $("#kpiDesperdicio").textContent = litrosDesp;
    $("#kpiRendimiento").textContent = rendimiento;
    $("#kpiEnvases").textContent = stock;

    // Producción por mes
    const mapMes = {};
    (lotes||[]).forEach(l=>{
      const m = (l.fecha_inicio_lote||"").slice(0,7);
      if(!m) return;
      mapMes[m] = (mapMes[m]||0) + (+l.litros_producidos||0);
    });
    const labels = Object.keys(mapMes).sort();
    const data = labels.map(k=>mapMes[k]);

    drawChart("chartProduccion", {
      type: "bar",
      data: { labels, datasets: [{ label: "Litros", data }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,   // usa altura de .chart-wrap
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
        layout: { padding: 8 }
      }
    });

    // Desperdicio por causa
    const mapCausa = {};
    (desperdicios||[]).forEach(d=>{
      const c = d.causa || d.nombre_causa || d.nombre_desperdicio || `Causa ${d.id_causa}`;
      mapCausa[c] = (mapCausa[c]||0) + (+d.litros||0);
    });
    const labels2 = Object.keys(mapCausa);
    const data2 = labels2.map(k=>mapCausa[k]);

    drawChart("chartDesperdicio", {
      type: "doughnut",
      data: { labels: labels2, datasets: [{ data: data2 }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "55%",
        plugins: { legend: { position: "right" } },
        layout: { padding: 8 }
      }
    });
  }catch(e){ ui.err(e); }
}

// ========= LOTES =========
async function renderLotes(){
  try{
    const estado = $("#fEstado").value;
    const desde = $("#fDesde").value;
    const hasta = $("#fHasta").value;

    let lotes = await api("/lotes");
    lotes = (lotes||[]).filter(l=>
      (!estado || l.estado === estado) &&
      (!desdefecha(desde) || compDate(l.fecha_inicio_lote) >= desdefecha(desde)) &&
      (!hastafecha(hasta) || compDate(l.fecha_fin_lote || l.fecha_inicio_lote) <= hastafecha(hasta))
    );

    $("#tbLotes").innerHTML = (lotes||[]).map(l=>`
      <tr>
        <td>${l.codigo_lote || l.codigo || ""}</td>
        <td>${l.estilo?.nombre_estilo || l.nombre_estilo || l.id_estilo || ""}</td>
        <td>${ui.fmtDate(l.fecha_inicio_lote)}</td>
        <td>${ui.fmtDate(l.fecha_fin_lote)}</td>
        <td>${l.litros_producidos || 0}</td>
        <td><span class="tag">${l.estado || ""}</span></td>
        <td class="text-right"></td>
      </tr>
    `).join("");

    await fillSelects();
  }catch(e){ ui.err(e); }
}
function compDate(d){ return d ? new Date(d).getTime() : 0; }
function desdefecha(v){ return v ? new Date(v).getTime() : null; }
function hastafecha(v){ return v ? new Date(v).getTime() : null; }
$("#btnAplicarFiltros").addEventListener("click", ()=> renderLotes());

$("#btnSaveLote").addEventListener("click", async (ev)=>{
  ev.preventDefault();
  const body = {
    codigo_lote: $("#loteCodigo").value.trim(),
    id_estilo: +$("#loteEstilo").value,
    fecha_inicio_lote: $("#loteInicio").value,
    fecha_fin_lote: $("#loteFin").value || null,
    litros_producidos: +$("#loteLitros").value,
    estado: $("#loteEstado").value
  };
  try{
    await api("/lotes", { method:"POST", body: JSON.stringify(body) });
    ui.closeDialog("dlgLote");
    await renderLotes();
    await renderDashboard();
  }catch(e){ ui.err(e); }
});

// ========= INVENTARIO =========
async function renderInventario(){
  try{
    const inventario = await api("/inventario-envases");
    $("#tbInventario").innerHTML = (inventario||[]).map(i=>`
      <tr>
        <td>${i.tipo?.nombre_tipo || i.nombre_tipo || i.envase || i.id_envase_tipo}</td>
        <td>${i.tipo?.capacidad_litros ?? i.capacidad_litros ?? ""}</td>
        <td>${i.cantidad_envase ?? i.stock_actual ?? 0}</td>
        <td class="text-right"><button class="btn text-xs" onclick="ui.openDialog('dlgAjusteStock')">Ajustar</button></td>
      </tr>
    `).join("");
    await fillSelects();
  }catch(e){ ui.err(e); }
}
$("#btnSaveAjuste").addEventListener("click", async (ev)=>{
  ev.preventDefault();
  const id = $("#ajusteEnvase").value;
  const cantidad_envase = +$("#ajusteCantidad").value;
  try{
    await api(`/inventario-envases/${id}`, { method:"PATCH", body: JSON.stringify({ cantidad_envase }) });
    ui.closeDialog("dlgAjusteStock");
    await renderInventario();
    await renderDashboard();
  }catch(e){ ui.err(e); }
});

// ========= MOVIMIENTOS =========
async function renderMovimientos(){
  try{
    const data = await api("/movimientos-envase");
    $("#tbMovimientos").innerHTML = (data||[]).map(m=>`
      <tr>
        <td>${(m.fecha||"").replace("T"," ").slice(0,16)}</td>
        <td>${m.tipo?.nombre_tipo || m.id_envase_tipo}</td>
        <td>${m.tipo_mov}</td>
        <td>${m.cantidad}</td>
        <td>${m.lote?.codigo_lote || m.id_lote || ""}</td>
        <td>${m.nota || ""}</td>
      </tr>
    `).join("");
    await fillSelects();
  }catch(e){ ui.err(e); }
}
$("#btnSaveMov").addEventListener("click", async (ev)=>{
  ev.preventDefault();
  const body = {
    id_envase_tipo: +$("#movEnvase").value,
    fecha: $("#movFecha").value,
    tipo_mov: $("#movTipo").value,
    cantidad: +$("#movCantidad").value,
    id_lote: $("#movLote").value ? +$("#movLote").value : null,
    nota: $("#movNota").value.trim() || null
  };
  try{
    await api("/movimientos-envase", { method:"POST", body: JSON.stringify(body) });
    ui.closeDialog("dlgMov");
    await renderMovimientos();
    await renderInventario();
    await renderDashboard();
  }catch(e){ ui.err(e); }
});

// ========= DESPERDICIO =========
async function renderDesperdicio(){
  try{
    const data = await api("/desperdicios");
    $("#tbDesperdicio").innerHTML = (data||[]).map(d=>`
      <tr>
        <td>${ui.fmtDate(d.fecha)}</td>
        <td>${d.lote?.codigo_lote || d.id_lote}</td>
        <td>${d.causa?.nombre_desperdicio || d.nombre_desperdicio || d.id_causa}</td>
        <td>${d.litros}</td>
        <td>${d.comentario || ""}</td>
      </tr>
    `).join("");
    await fillSelects();
  }catch(e){ ui.err(e); }
}
$("#btnSaveDesp").addEventListener("click", async (ev)=>{
  ev.preventDefault();
  const body = {
    id_lote: +$("#despLote").value,
    fecha: $("#despFecha").value,
    litros: +$("#despLitros").value,
    id_causa: +$("#despCausa").value,
    comentario: $("#despComentario").value.trim() || null
  };
  try{
    await api("/desperdicios", { method:"POST", body: JSON.stringify(body) });
    ui.closeDialog("dlgDesp");
    await renderDesperdicio();
    await renderDashboard();
  }catch(e){ ui.err(e); }
});

// ========= SELECTS =========
async function fillSelects(){
  try{
    const [estilos, envases, lotes, causas] = await Promise.all([
      api("/estilos"),
      api("/envase-tipos"),
      api("/lotes"),
      api("/causas-desperdicio")
    ]);

    const selEstilo = $("#loteEstilo");
    if(selEstilo){
      selEstilo.innerHTML = (estilos||[]).map(e=>`
        <option value="${e.id_estilo}">${e.nombre_estilo}</option>
      `).join("");
    }

    const selEnv = $("#movEnvase");
    if(selEnv){
      selEnv.innerHTML = (envases||[]).map(e=>`
        <option value="${e.id_envase_tipo}">${e.nombre_tipo} • ${e.capacidad_litros}L</option>
      `).join("");
    }

    const selAj = $("#ajusteEnvase");
    if(selAj){
      selAj.innerHTML = (envases||[]).map(e=>`
        <option value="${e.id_envase_tipo}">${e.nombre_tipo} • ${e.capacidad_litros}L</option>
      `).join("");
    }

    const selMovLote = $("#movLote");
    if(selMovLote){
      selMovLote.innerHTML = `<option value="">(Ninguno)</option>` + (lotes||[]).map(l=>`
        <option value="${l.id_lote}">${l.codigo_lote || l.codigo}</option>
      `).join("");
    }

    const selDespLote = $("#despLote");
    if(selDespLote){
      selDespLote.innerHTML = (lotes||[]).map(l=>`
        <option value="${l.id_lote}">${l.codigo_lote || l.codigo}</option>
      `).join("");
    }

    const selCausa = $("#despCausa");
    if(selCausa){
      selCausa.innerHTML = (causas||[]).map(c=>`
        <option value="${c.id_causa}">${c.nombre_desperdicio}</option>
      `).join("");
    }
  }catch(e){ ui.err(e); }
}

// ========= NAV =========
$all(".navlink").forEach(a => a.addEventListener("click", (e)=>{
  e.preventDefault();
  const v = a.dataset.view;
  ui.setActive(v);
  if(v==="dashboard") renderDashboard();
  if(v==="lotes") renderLotes();
  if(v==="inventario") renderInventario();
  if(v==="movimientos") renderMovimientos();
  if(v==="desperdicio") renderDesperdicio();
  if(v==="catalogos") renderCatalogos();
}));

// ========= INIT =========
async function init(){
  initTopbar();
  ui.setActive("dashboard");
  await renderDashboard();
  window.addEventListener("resize", ()=> {
    charts.chartProduccion?.resize?.();
    charts.chartDesperdicio?.resize?.();
  });
}
init();
