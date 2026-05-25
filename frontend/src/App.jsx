import { useState, useEffect, useCallback } from "react";
import { api, descargar, fetchBlobUrl, uploadFile } from "./api";

// ── Constantes ────────────────────────────────────────────────
const B = "var(--color-border-tertiary)";
const inits = n => (n||"?").replace(/^Dr[a]?\.?\s+/i,"").split(" ").slice(0,2).map(w=>w[0]||"").join("").toUpperCase()||"?";

const NAV = [
  { id:"dashboard",      label:"Panel General",     icon:"ti-layout-dashboard" },
  { id:"areas",          label:"Areas del Estudio", icon:"ti-books" },
  { id:"expedientes",    label:"Expedientes",        icon:"ti-folder-open" },
  { id:"clientes",       label:"Clientes",           icon:"ti-users" },
  { id:"contrapartes",   label:"Contrapartes",       icon:"ti-user-x" },
  { id:"abogados",       label:"Abogados",           icon:"ti-user-circle" },
  { id:"juzgados",       label:"Juzgados",           icon:"ti-building-courthouse" },
  { id:"modelos",        label:"Modelos",            icon:"ti-file-text" },
  { id:"escritos",       label:"Escritos Propios",  icon:"ti-file-upload" },
  { id:"doctrina",       label:"Doctrina",           icon:"ti-notebook" },
  { id:"jurisprudencia", label:"Jurisprudencia",     icon:"ti-gavel" },
  { id:"leyes",          label:"Legislacion",        icon:"ti-file-certificate" },
  { id:"investigacion",  label:"Investigacion IA",   icon:"ti-search" },
];

const ICONOS = [
  "ti-books","ti-scale","ti-briefcase","ti-building-skyscraper","ti-users","ti-id-badge-2",
  "ti-home","ti-car","ti-heartbeat","ti-landmark","ti-globe","ti-leaf","ti-shield",
  "ti-bank","ti-file-certificate","ti-gavel","ti-certificate","ti-building-courthouse","ti-user-circle",
];
const COLORES   = ["info","success","warning","danger","secondary"];
const ROL_LABEL = { socio:"Socio", abogado:"Abogado", administrador:"Administrador" };
const FUENTES   = ["LL","ED","JA","DT","TSS","Libro","Otro"];
const TRIBUNALES= ["CSJN","CNCom","CNCiv","CNAT","CNCont","CNFed","STJ","Camara Provincial","Juzgado de 1a Instancia","Otro"];
const TIPOS_LEY = ["ley","decreto","resolucion","disposicion","ordenanza","convenio"];
const ROLES_PROC= ["Demandado","Actor","Tercero","Deudor","Acreedor","Garante","Interveniente","Otro"];

// ── Componentes base ─────────────────────────────────────────
const BADGE_MAP = {
  activo:["success","Activo"],cerrado:["secondary","Cerrado"],suspendido:["warning","Suspendido"],
  actual:["info","Actual"],potencial:["warning","Potencial"],
  fisica:["info","Fisica"],juridica:["success","Juridica"],
  ley:["info","Ley"],decreto:["warning","Decreto"],resolucion:["secondary","Resol."],
  disposicion:["secondary","Dispos."],ordenanza:["secondary","Ordenanza"],convenio:["success","Convenio"],
};
const Badge = ({v}) => {
  const [c,l] = BADGE_MAP[v] || ["secondary", v||"—"];
  return <span style={{background:`var(--color-background-${c})`,color:`var(--color-text-${c})`,fontSize:11,padding:"2px 9px",borderRadius:20,fontWeight:500,whiteSpace:"nowrap"}}>{l}</span>;
};
const AreaBadge = ({area,color="secondary"}) => (
  <span style={{background:`var(--color-background-${color})`,color:`var(--color-text-${color})`,fontSize:11,padding:"2px 9px",borderRadius:20}}>{area}</span>
);
const Avatar = ({name,size=36,color="info"}) => (
  <div style={{width:size,height:size,borderRadius:"50%",background:`var(--color-background-${color})`,color:`var(--color-text-${color})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:500,fontSize:size<32?11:13,flexShrink:0}}>
    {inits(name)}
  </div>
);
const Spinner = () => <i className="ti ti-loader-2 ti-spin"/>;
const Err = ({msg}) => msg ? <div style={{color:"var(--color-text-danger)",fontSize:13,marginTop:8,padding:"6px 10px",background:"var(--color-background-danger)",borderRadius:6}}>{msg}</div> : null;

const Modal = ({title,onClose,children,wide}) => (
  <div style={{position:"fixed",inset:0,zIndex:50,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:40,overflowY:"auto"}}>
    <div style={{background:"var(--color-background-primary)",borderRadius:"var(--border-radius-lg)",border:`0.5px solid ${B}`,padding:"1.5rem",width:wide?760:580,maxWidth:"95%",maxHeight:"88vh",overflowY:"auto",margin:"0 auto 40px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
        <h2 style={{margin:0,fontSize:16,fontWeight:500}}>{title}</h2>
        <button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",padding:4,color:"var(--color-text-secondary)",fontSize:18}}><i className="ti ti-x"/></button>
      </div>
      {children}
    </div>
  </div>
);
const Campo = ({label,children,col}) => (
  <div style={col?{gridColumn:col}:{}}>
    <label style={{fontSize:11,color:"var(--color-text-secondary)",display:"block",marginBottom:3}}>{label}</label>
    {children}
  </div>
);
const Grid = ({cols=2,children,gap=10}) => (
  <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap}}>{children}</div>
);
const DetailRow = ({label,value,mono}) => {
  if (!value) return null;
  return (
    <div style={{marginBottom:12}}>
      <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:3}}>{label}</div>
      <div style={{fontSize:13,lineHeight:1.5,fontFamily:mono?"var(--font-mono)":undefined,whiteSpace:value.length>100?"pre-wrap":"normal"}}>{value}</div>
    </div>
  );
};
const Sect = ({title,color="secondary",children}) => (
  <div style={{marginBottom:"1.5rem"}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
      <div style={{width:4,height:18,background:`var(--color-border-${color})`,borderRadius:2}}/>
      <h2 style={{margin:0,fontSize:15,fontWeight:500}}>{title}</h2>
    </div>
    {children}
  </div>
);

// ── Formularios ──────────────────────────────────────────────
function BtnSave({onClick,disabled,loading,label="Guardar"}) {
  return <button onClick={onClick} disabled={disabled||loading} style={{background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)"}}>{loading?<Spinner/>:label}</button>;
}
function FormFooter({onCancel,onSave,loading,disabled}) {
  return <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:8}}><button onClick={onCancel} disabled={loading}>Cancelar</button><BtnSave onClick={onSave} loading={loading} disabled={disabled}/></div>;
}

function ExpForm({initial,abogados,clientes,areas,onSave,onCancel,loading}) {
  const [d,setD]=useState(initial||{caratula:"",area:areas[0]?.nombre||"Civil",estado:"activo",id_cliente:"",id_abogado:"",juzgado:"",apertura:"",prox_fecha:"",notas:""});
  const set=(k,v)=>setD(p=>({...p,[k]:v}));
  return <div style={{display:"flex",flexDirection:"column",gap:10}}>
    <Campo label="Caratula *"><input value={d.caratula} onChange={e=>set("caratula",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    <Grid>
      <Campo label="Area"><select value={d.area} onChange={e=>set("area",e.target.value)} style={{width:"100%",marginTop:4}}>{areas.map(a=><option key={a.id}>{a.nombre}</option>)}</select></Campo>
      <Campo label="Estado"><select value={d.estado} onChange={e=>set("estado",e.target.value)} style={{width:"100%",marginTop:4}}><option value="activo">Activo</option><option value="cerrado">Cerrado</option><option value="suspendido">Suspendido</option></select></Campo>
      <Campo label="Cliente"><select value={d.id_cliente||""} onChange={e=>set("id_cliente",e.target.value)} style={{width:"100%",marginTop:4}}><option value="">— Sin asignar —</option>{clientes.map(c=><option key={c.id} value={c.id}>{c.razon}</option>)}</select></Campo>
      <Campo label="Abogado"><select value={d.id_abogado||""} onChange={e=>set("id_abogado",e.target.value)} style={{width:"100%",marginTop:4}}><option value="">— Sin asignar —</option>{abogados.filter(a=>a.activo).map(a=><option key={a.id} value={a.id}>{a.nombre}</option>)}</select></Campo>
    </Grid>
    <Campo label="Juzgado / Organismo"><input value={d.juzgado||""} onChange={e=>set("juzgado",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    <Grid>
      <Campo label="Fecha apertura"><input type="date" value={d.apertura||""} onChange={e=>set("apertura",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Proxima fecha"><input type="date" value={d.prox_fecha||""} onChange={e=>set("prox_fecha",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    </Grid>
    <Campo label="Notas"><textarea value={d.notas||""} onChange={e=>set("notas",e.target.value)} rows={2} style={{width:"100%",marginTop:4}}/></Campo>
    <FormFooter onCancel={onCancel} onSave={()=>onSave(d)} loading={loading} disabled={!d.caratula}/>
  </div>;
}

function ClienteForm({initial,areas,onSave,onCancel,loading}) {
  const [d,setD]=useState(initial||{razon:"",tipo:"actual",area:"",cuit:"",contacto:"",email:"",tel:"",notas:""});
  const set=(k,v)=>setD(p=>({...p,[k]:v}));
  return <div style={{display:"flex",flexDirection:"column",gap:10}}>
    <Campo label="Razon social / Nombre *"><input value={d.razon} onChange={e=>set("razon",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    <Grid>
      <Campo label="Tipo"><select value={d.tipo} onChange={e=>set("tipo",e.target.value)} style={{width:"100%",marginTop:4}}><option value="actual">Actual</option><option value="potencial">Potencial</option></select></Campo>
      <Campo label="Area"><select value={d.area||""} onChange={e=>set("area",e.target.value)} style={{width:"100%",marginTop:4}}><option value="">— Sin area —</option>{areas.map(a=><option key={a.id}>{a.nombre}</option>)}</select></Campo>
      <Campo label="CUIT"><input value={d.cuit||""} onChange={e=>set("cuit",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Contacto"><input value={d.contacto||""} onChange={e=>set("contacto",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Email"><input type="email" value={d.email||""} onChange={e=>set("email",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Telefono"><input value={d.tel||""} onChange={e=>set("tel",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    </Grid>
    <Campo label="Notas"><textarea value={d.notas||""} onChange={e=>set("notas",e.target.value)} rows={2} style={{width:"100%",marginTop:4}}/></Campo>
    <FormFooter onCancel={onCancel} onSave={()=>onSave(d)} loading={loading} disabled={!d.razon}/>
  </div>;
}

function ContraparteForm({initial,areas,onSave,onCancel,loading}) {
  const [d,setD]=useState(initial||{tipo:"fisica",nombre:"",razon_social:"",dni:"",cuit:"",email:"",tel:"",celular:"",domicilio:"",localidad:"",provincia:"Buenos Aires",cp:"",abogado_contraparte:"",mat_abogado:"",rol_procesal:"Demandado",area:"",observaciones:"",notas_internas:""});
  const set=(k,v)=>setD(p=>({...p,[k]:v}));
  return <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:"72vh",overflowY:"auto",paddingRight:4}}>
    <Grid>
      <Campo label="Tipo de persona"><select value={d.tipo} onChange={e=>set("tipo",e.target.value)} style={{width:"100%",marginTop:4}}><option value="fisica">Persona Fisica</option><option value="juridica">Persona Juridica</option></select></Campo>
      <Campo label="Rol procesal"><select value={d.rol_procesal||""} onChange={e=>set("rol_procesal",e.target.value)} style={{width:"100%",marginTop:4}}><option value="">— Sin rol —</option>{ROLES_PROC.map(r=><option key={r}>{r}</option>)}</select></Campo>
    </Grid>
    <Campo label={d.tipo==="juridica"?"Razon social *":"Apellido y nombre *"}><input value={d.nombre} onChange={e=>set("nombre",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    {d.tipo==="juridica"&&<Campo label="Nombre fantasia"><input value={d.razon_social||""} onChange={e=>set("razon_social",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>}
    <Grid>
      <Campo label="DNI"><input value={d.dni||""} onChange={e=>set("dni",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="CUIT"><input value={d.cuit||""} onChange={e=>set("cuit",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Email"><input type="email" value={d.email||""} onChange={e=>set("email",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Telefono"><input value={d.tel||""} onChange={e=>set("tel",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Celular"><input value={d.celular||""} onChange={e=>set("celular",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Area del asunto"><select value={d.area||""} onChange={e=>set("area",e.target.value)} style={{width:"100%",marginTop:4}}><option value="">— Sin area —</option>{areas.map(a=><option key={a.id}>{a.nombre}</option>)}</select></Campo>
    </Grid>
    <Campo label="Domicilio"><input value={d.domicilio||""} onChange={e=>set("domicilio",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    <Grid cols={3}>
      <Campo label="Localidad"><input value={d.localidad||""} onChange={e=>set("localidad",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Provincia"><input value={d.provincia||""} onChange={e=>set("provincia",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Cod. Postal"><input value={d.cp||""} onChange={e=>set("cp",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    </Grid>
    <div style={{borderTop:`0.5px solid ${B}`,paddingTop:10,marginTop:2}}>
      <div style={{fontSize:12,fontWeight:500,marginBottom:8,color:"var(--color-text-secondary)"}}>Letrado de la contraparte</div>
      <Grid>
        <Campo label="Nombre del abogado"><input value={d.abogado_contraparte||""} onChange={e=>set("abogado_contraparte",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
        <Campo label="Matricula / Tomo y Folio"><input value={d.mat_abogado||""} onChange={e=>set("mat_abogado",e.target.value)} style={{width:"100%",marginTop:4}} placeholder="Ej: T.85 F.372 CPACF"/></Campo>
      </Grid>
    </div>
    <Campo label="Observaciones"><textarea value={d.observaciones||""} onChange={e=>set("observaciones",e.target.value)} rows={2} style={{width:"100%",marginTop:4}}/></Campo>
    <Campo label="Notas internas (solo admin/socio)"><textarea value={d.notas_internas||""} onChange={e=>set("notas_internas",e.target.value)} rows={2} style={{width:"100%",marginTop:4,fontSize:12}}/></Campo>
    <FormFooter onCancel={onCancel} onSave={()=>onSave(d)} loading={loading} disabled={!d.nombre}/>
  </div>;
}

function DoctriinaForm({initial,areas,onSave,onCancel,loading}) {
  const [d,setD]=useState(initial||{titulo:"",autor:"",coautores:"",fuente:"LL",publicacion:"",fecha_publicacion:"",area:"",resumen:"",contenido:"",voces:"",url:""});
  const set=(k,v)=>setD(p=>({...p,[k]:v}));
  return <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:"72vh",overflowY:"auto",paddingRight:4}}>
    <Campo label="Titulo *"><input value={d.titulo} onChange={e=>set("titulo",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    <Grid>
      <Campo label="Autor"><input value={d.autor||""} onChange={e=>set("autor",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Coautores"><input value={d.coautores||""} onChange={e=>set("coautores",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Fuente"><select value={d.fuente||""} onChange={e=>set("fuente",e.target.value)} style={{width:"100%",marginTop:4}}>{FUENTES.map(f=><option key={f}>{f}</option>)}</select></Campo>
      <Campo label="Publicacion"><input value={d.publicacion||""} onChange={e=>set("publicacion",e.target.value)} style={{width:"100%",marginTop:4}} placeholder="Ej: La Ley 2024-A"/></Campo>
      <Campo label="Fecha"><input type="date" value={d.fecha_publicacion||""} onChange={e=>set("fecha_publicacion",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Area"><select value={d.area||""} onChange={e=>set("area",e.target.value)} style={{width:"100%",marginTop:4}}><option value="">— Todas las areas —</option>{areas.map(a=><option key={a.id}>{a.nombre}</option>)}</select></Campo>
    </Grid>
    <Campo label="Voces (palabras clave, separadas por coma)"><input value={d.voces||""} onChange={e=>set("voces",e.target.value)} style={{width:"100%",marginTop:4}} placeholder="responsabilidad civil, dano, CCyCN"/></Campo>
    <Campo label="Resumen"><textarea value={d.resumen||""} onChange={e=>set("resumen",e.target.value)} rows={3} style={{width:"100%",marginTop:4}}/></Campo>
    <Campo label="Contenido / Extracto"><textarea value={d.contenido||""} onChange={e=>set("contenido",e.target.value)} rows={5} style={{width:"100%",marginTop:4,fontSize:12}}/></Campo>
    <Campo label="URL externa"><input value={d.url||""} onChange={e=>set("url",e.target.value)} style={{width:"100%",marginTop:4}} placeholder="https://"/></Campo>
    <FormFooter onCancel={onCancel} onSave={()=>onSave(d)} loading={loading} disabled={!d.titulo}/>
  </div>;
}

function JurisprudenciaForm({initial,areas,onSave,onCancel,loading}) {
  const [d,setD]=useState(initial||{caratula:"",tribunal:"CSJN",sala:"",fecha_fallo:"",area:"",tema:"",voces:"",resumen:"",texto:"",cita:"",publicado_en:"",url:""});
  const set=(k,v)=>setD(p=>({...p,[k]:v}));
  return <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:"72vh",overflowY:"auto",paddingRight:4}}>
    <Campo label="Caratula *"><input value={d.caratula} onChange={e=>set("caratula",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    <Grid>
      <Campo label="Tribunal"><select value={d.tribunal||""} onChange={e=>set("tribunal",e.target.value)} style={{width:"100%",marginTop:4}}>{TRIBUNALES.map(t=><option key={t}>{t}</option>)}</select></Campo>
      <Campo label="Sala / Seccion"><input value={d.sala||""} onChange={e=>set("sala",e.target.value)} style={{width:"100%",marginTop:4}} placeholder="Ej: Sala A"/></Campo>
      <Campo label="Fecha del fallo"><input type="date" value={d.fecha_fallo||""} onChange={e=>set("fecha_fallo",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Area"><select value={d.area||""} onChange={e=>set("area",e.target.value)} style={{width:"100%",marginTop:4}}><option value="">— Todas —</option>{areas.map(a=><option key={a.id}>{a.nombre}</option>)}</select></Campo>
      <Campo label="Cita (Ej: Fallos 334:1387)"><input value={d.cita||""} onChange={e=>set("cita",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Publicado en (Ej: LL 2023-A)"><input value={d.publicado_en||""} onChange={e=>set("publicado_en",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    </Grid>
    <Campo label="Tema"><input value={d.tema||""} onChange={e=>set("tema",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    <Campo label="Voces"><input value={d.voces||""} onChange={e=>set("voces",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    <Campo label="Resumen"><textarea value={d.resumen||""} onChange={e=>set("resumen",e.target.value)} rows={3} style={{width:"100%",marginTop:4}}/></Campo>
    <Campo label="Texto del fallo (extracto)"><textarea value={d.texto||""} onChange={e=>set("texto",e.target.value)} rows={5} style={{width:"100%",marginTop:4,fontSize:12}}/></Campo>
    <Campo label="URL"><input value={d.url||""} onChange={e=>set("url",e.target.value)} style={{width:"100%",marginTop:4}} placeholder="https://"/></Campo>
    <FormFooter onCancel={onCancel} onSave={()=>onSave(d)} loading={loading} disabled={!d.caratula}/>
  </div>;
}

function LeyForm({initial,areas,onSave,onCancel,loading}) {
  const [d,setD]=useState(initial||{numero:"",nombre:"",tipo:"ley",organismo:"Honorable Congreso de la Nacion",fecha_sancion:"",fecha_promulgacion:"",fecha_vigencia:"",boletin_numero:"",boletin_fecha:"",area:"",resumen:"",texto:"",url_infoleg:""});
  const set=(k,v)=>setD(p=>({...p,[k]:v}));
  return <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:"72vh",overflowY:"auto",paddingRight:4}}>
    <Grid>
      <Campo label="Numero *"><input value={d.numero} onChange={e=>set("numero",e.target.value)} style={{width:"100%",marginTop:4}} placeholder="Ej: 20744"/></Campo>
      <Campo label="Tipo"><select value={d.tipo} onChange={e=>set("tipo",e.target.value)} style={{width:"100%",marginTop:4}}>{TIPOS_LEY.map(t=><option key={t}>{t}</option>)}</select></Campo>
    </Grid>
    <Campo label="Nombre *"><input value={d.nombre} onChange={e=>set("nombre",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    <Grid>
      <Campo label="Organismo"><input value={d.organismo||""} onChange={e=>set("organismo",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Area"><select value={d.area||""} onChange={e=>set("area",e.target.value)} style={{width:"100%",marginTop:4}}><option value="">— Todas —</option>{areas.map(a=><option key={a.id}>{a.nombre}</option>)}</select></Campo>
      <Campo label="Fecha sancion"><input type="date" value={d.fecha_sancion||""} onChange={e=>set("fecha_sancion",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Fecha promulgacion"><input type="date" value={d.fecha_promulgacion||""} onChange={e=>set("fecha_promulgacion",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Fecha vigencia"><input type="date" value={d.fecha_vigencia||""} onChange={e=>set("fecha_vigencia",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="N Boletin Oficial"><input value={d.boletin_numero||""} onChange={e=>set("boletin_numero",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    </Grid>
    <Campo label="Resumen"><textarea value={d.resumen||""} onChange={e=>set("resumen",e.target.value)} rows={3} style={{width:"100%",marginTop:4}}/></Campo>
    <Campo label="Articulos clave (extracto)"><textarea value={d.texto||""} onChange={e=>set("texto",e.target.value)} rows={5} style={{width:"100%",marginTop:4,fontSize:12}}/></Campo>
    <Campo label="URL InfoLEG"><input value={d.url_infoleg||""} onChange={e=>set("url_infoleg",e.target.value)} style={{width:"100%",marginTop:4}} placeholder="https://www.infoleg.gob.ar/..."/></Campo>
    <FormFooter onCancel={onCancel} onSave={()=>onSave(d)} loading={loading} disabled={!d.numero||!d.nombre}/>
  </div>;
}

function AreaForm({initial,onSave,onCancel,loading}) {
  const [d,setD]=useState(initial||{nombre:"",icon:"ti-books",color:"info",descripcion:"",orden:0});
  const set=(k,v)=>setD(p=>({...p,[k]:v}));
  return <div style={{display:"flex",flexDirection:"column",gap:12}}>
    <Campo label="Nombre del area *"><input value={d.nombre} onChange={e=>set("nombre",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    <Campo label="Descripcion"><textarea value={d.descripcion||""} onChange={e=>set("descripcion",e.target.value)} rows={2} style={{width:"100%",marginTop:4}}/></Campo>
    <Grid>
      <Campo label="Orden (numero)"><input type="number" value={d.orden||0} onChange={e=>set("orden",parseInt(e.target.value)||0)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Color">
        <div style={{display:"flex",gap:6,marginTop:4}}>
          {COLORES.map(c=><button key={c} onClick={()=>set("color",c)} style={{flex:1,padding:"6px 0",border:`1.5px solid ${d.color===c?"var(--color-border-"+c+")":B}`,borderRadius:6,background:`var(--color-background-${c})`,cursor:"pointer",fontSize:11,color:`var(--color-text-${c})`}}>{c[0].toUpperCase()+c.slice(1)}</button>)}
        </div>
      </Campo>
    </Grid>
    <Campo label="Icono">
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:4}}>
        {ICONOS.map(ico=><button key={ico} onClick={()=>set("icon",ico)} style={{padding:"8px 10px",border:`1.5px solid ${d.icon===ico?"var(--color-border-info)":B}`,borderRadius:6,background:d.icon===ico?"var(--color-background-info)":"none",cursor:"pointer"}} title={ico}><i className={`ti ${ico}`} style={{fontSize:17,color:d.icon===ico?"var(--color-text-info)":"var(--color-text-secondary)"}}/></button>)}
      </div>
    </Campo>
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"var(--color-background-secondary)",borderRadius:8,border:`0.5px solid ${B}`}}>
      <div style={{width:44,height:44,borderRadius:8,background:`var(--color-background-${d.color})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <i className={`ti ${d.icon}`} style={{fontSize:22,color:`var(--color-text-${d.color})`}}/>
      </div>
      <div><div style={{fontSize:15,fontWeight:500}}>{d.nombre||"Vista previa"}</div><div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{d.descripcion||"Descripcion del area"}</div></div>
    </div>
    <FormFooter onCancel={onCancel} onSave={()=>onSave(d)} loading={loading} disabled={!d.nombre}/>
  </div>;
}

function AbogadoForm({initial,onSave,onCancel,loading}) {
  const [d,setD]=useState(initial||{nombre:"",tipo:"interno",matricula:"",especialidad:"",email:"",tel:"",celular:"",dni:"",domicilio:"",localidad:"",provincia:"Buenos Aires",cp:"",fecha_nac:"",notas_internas:"",activo:true});
  const set=(k,v)=>setD(p=>({...p,[k]:v}));
  return <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:"70vh",overflowY:"auto",paddingRight:4}}>
    <Campo label="Nombre y apellido *"><input value={d.nombre} onChange={e=>set("nombre",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
    <Grid>
      <Campo label="Tipo"><select value={d.tipo} onChange={e=>set("tipo",e.target.value)} style={{width:"100%",marginTop:4}}><option value="interno">Abogado del estudio</option><option value="externo">Externo/Contrario</option></select></Campo>
      <Campo label="Estado"><select value={d.activo?"activo":"inactivo"} onChange={e=>set("activo",e.target.value==="activo")} style={{width:"100%",marginTop:4}}><option value="activo">Activo</option><option value="inactivo">Inactivo</option></select></Campo>
      <Campo label="DNI"><input value={d.dni||""} onChange={e=>set("dni",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Fecha de nacimiento"><input type="date" value={d.fecha_nac||""} onChange={e=>set("fecha_nac",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Matricula principal"><input value={d.matricula||""} onChange={e=>set("matricula",e.target.value)} style={{width:"100%",marginTop:4}} placeholder="Ej: CPACF T.85 F.372"/></Campo>
      <Campo label="Especialidad"><input value={d.especialidad||""} onChange={e=>set("especialidad",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Email"><input type="email" value={d.email||""} onChange={e=>set("email",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Telefono"><input value={d.tel||""} onChange={e=>set("tel",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Celular"><input value={d.celular||""} onChange={e=>set("celular",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Domicilio" col="1/-1"><input value={d.domicilio||""} onChange={e=>set("domicilio",e.target.value)} style={{width:"100%",marginTop:4}}/></Campo>
      <Campo label="Notas internas" col="1/-1"><textarea rows={2} value={d.notas_internas||""} onChange={e=>set("notas_internas",e.target.value)} style={{width:"100%",fontSize:12,marginTop:4}}/></Campo>
    </Grid>
    <FormFooter onCancel={onCancel} onSave={()=>onSave(d)} loading={loading} disabled={!d.nombre}/>
  </div>;
}


// ── EscriitosPropios ─────────────────────────────────────────
// agrupa documentos por "materia" (= categoria || area || "Sin clasificar")
// dentro de cada módulo los ordena A-Z por título

function EscriitosPropios({ escritos, cats, areas, exps, areaColor, isAdmin, onRefresh, B }) {
  const [q,        setQ]        = useState("");
  const [areaF,    setAreaF]    = useState("");
  const [open,     setOpen]     = useState({});      // { materia: true/false }
  const [detalle,  setDetalle]  = useState(null);
  const [showUp,   setShowUp]   = useState(false);
  const [editando, setEditando] = useState(null);
  const [pdfUrl,   setPdfUrl]   = useState(null);
  const [pdfLoad,  setPdfLoad]  = useState(false);

  const clearPdf = () => { if (pdfUrl) { URL.revokeObjectURL(pdfUrl); setPdfUrl(null); } };

  // Cleanup: revocar blob URL al desmontar el componente o al cambiar de ruta
  useEffect(() => {
    return () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); };
  }, [pdfUrl]);

  const openDetail = async (e) => {
    clearPdf();
    setDetalle(e);
    if (e.extension === '.pdf') {
      setPdfLoad(true);
      try { const url = await fetchBlobUrl(`/api/escritos/file/${e.id}`); setPdfUrl(url); }
      catch { setPdfUrl(null); }
      setPdfLoad(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este escrito y su archivo?")) return;
    try { await api.delete(`/api/escritos/${id}`); clearPdf(); setDetalle(null); await onRefresh(); }
    catch (e) { alert(e.message); }
  };

  const toggleOpen = (m) => setOpen(p => ({ ...p, [m]: !p[m] }));
  const expandAll  = (groups) => setOpen(Object.fromEntries(groups.map(([m]) => [m, true])));
  const collapseAll= () => setOpen({});

  // ── agrupación ──────────────────────────────────────────────
  // materia = categoria si existe, sino area, sino "Sin clasificar"
  const materiaKey = e => (e.categoria?.trim() || e.area?.trim() || "Sin clasificar");

  const filtered = escritos.filter(e =>
    (!areaF || e.area === areaF) &&
    (!q     || (e.titulo + (e.descripcion||"") + (e.tags||"")).toLowerCase().includes(q.toLowerCase()))
  );

  // agrupar y ordenar cada grupo A-Z
  const groupMap = filtered.reduce((acc, e) => {
    const k = materiaKey(e);
    if (!acc[k]) acc[k] = [];
    acc[k].push(e);
    return acc;
  }, {});
  Object.values(groupMap).forEach(arr =>
    arr.sort((a, b) => a.titulo.localeCompare(b.titulo, "es", { sensitivity: "base" }))
  );
  // grupos ordenados: primero los que tienen área, luego "Sin clasificar"
  const groups = Object.entries(groupMap).sort(([a],[b]) => {
    if (a === "Sin clasificar") return 1;
    if (b === "Sin clasificar") return -1;
    return a.localeCompare(b, "es", { sensitivity: "base" });
  });

  const EXT_ICON  = { '.pdf':'ti-file-type-pdf', '.docx':'ti-file-type-docx', '.doc':'ti-file-type-doc', '.txt':'ti-file-type-txt' };
  const EXT_COLOR = { '.pdf':'danger', '.docx':'info', '.doc':'info', '.txt':'secondary' };
  const fmtSize   = b => b > 1048576 ? `${(b/1048576).toFixed(1)} MB` : `${Math.round(b/1024)} KB`;

  // ── vista de detalle ─────────────────────────────────────────
  if (detalle) return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1.25rem"}}>
        <button onClick={()=>{clearPdf();setDetalle(null);}} style={{fontSize:13,display:"flex",alignItems:"center",gap:5}}>
          <i className="ti ti-arrow-left" style={{fontSize:14}}/> Volver
        </button>
        <div style={{display:"flex",gap:8}}>
          <button onClick={async()=>{const url=await fetchBlobUrl(`/api/escritos/file/${detalle.id}`);const a=document.createElement('a');a.href=url;a.download=detalle.original_name||detalle.titulo;a.click();URL.revokeObjectURL(url);}}
            style={{fontSize:13,display:"flex",alignItems:"center",gap:5,color:"var(--color-text-success)",border:"0.5px solid var(--color-border-success)",background:"var(--color-background-success)"}}>
            <i className="ti ti-download"/> Descargar
          </button>
          <button onClick={()=>setEditando(detalle)} style={{fontSize:13,display:"flex",alignItems:"center",gap:5}}>
            <i className="ti ti-edit"/> Editar
          </button>
          {isAdmin&&<button onClick={()=>handleDelete(detalle.id)} style={{fontSize:13,color:"var(--color-text-danger)",border:"0.5px solid var(--color-border-danger)",background:"var(--color-background-danger)"}}>
            <i className="ti ti-trash"/>
          </button>}
        </div>
      </div>

      {editando&&(
        <div style={{position:"fixed",inset:0,zIndex:60,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"var(--color-background-primary)",borderRadius:"var(--border-radius-lg)",border:`0.5px solid ${B}`,padding:"1.5rem",width:540,maxWidth:"95%"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1rem"}}>
              <h3 style={{margin:0,fontSize:15,fontWeight:500}}>Editar datos</h3>
              <button onClick={()=>setEditando(null)} style={{border:"none",background:"none",cursor:"pointer",fontSize:18}}><i className="ti ti-x"/></button>
            </div>
            <EscritoMetaForm initial={editando} areas={areas} cats={cats} exps={exps}
              onSave={async d=>{try{const u=await api.put(`/api/escritos/${editando.id}`,d);setEditando(null);setDetalle(u);await onRefresh();}catch(e){alert(e.message);}}}
              onCancel={()=>setEditando(null)}/>
          </div>
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:14,alignItems:"flex-start"}}>
        <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.25rem"}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:14}}>
            <div style={{width:40,height:40,borderRadius:8,background:`var(--color-background-${EXT_COLOR[detalle.extension]||"secondary"})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <i className={`ti ${EXT_ICON[detalle.extension]||"ti-file"}`} style={{fontSize:20,color:`var(--color-text-${EXT_COLOR[detalle.extension]||"secondary"})`}}/>
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:500,lineHeight:1.4}}>{detalle.titulo}</div>
              <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:2}}>{detalle.original_name}</div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,fontSize:12,borderTop:`0.5px solid ${B}`,paddingTop:12}}>
            {detalle.categoria&&<div><span style={{color:"var(--color-text-secondary)"}}>Materia: </span><span style={{fontWeight:500}}>{detalle.categoria}</span></div>}
            {detalle.area&&<div><span style={{color:"var(--color-text-secondary)"}}>Área: </span><span style={{fontWeight:500}}>{detalle.area}</span></div>}
            {detalle.exp_caratula&&<div><span style={{color:"var(--color-text-secondary)"}}>Expediente: </span><span style={{fontWeight:500,lineHeight:1.4}}>{detalle.exp_caratula}</span></div>}
            {detalle.size_bytes&&<div><span style={{color:"var(--color-text-secondary)"}}>Tamaño: </span><span>{fmtSize(detalle.size_bytes)}</span></div>}
            <div><span style={{color:"var(--color-text-secondary)"}}>Cargado: </span><span>{detalle.creado_en?.slice(0,10)}</span></div>
          </div>
          {detalle.descripcion&&<div style={{marginTop:12,borderTop:`0.5px solid ${B}`,paddingTop:10,fontSize:12,lineHeight:1.6,color:"var(--color-text-secondary)"}}>{detalle.descripcion}</div>}
          {detalle.tags&&<div style={{marginTop:10}}>{detalle.tags.split(",").map((t,i)=><span key={i} style={{background:"var(--color-background-secondary)",padding:"2px 7px",borderRadius:12,marginRight:4,fontSize:11}}>{t.trim()}</span>)}</div>}
          {detalle.notas&&<div style={{marginTop:12,background:"var(--color-background-warning)",borderRadius:6,padding:"8px 10px",fontSize:12}}><div style={{fontSize:10,color:"var(--color-text-warning)",marginBottom:3,fontWeight:500}}>NOTAS</div>{detalle.notas}</div>}
        </div>

        <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",overflow:"hidden",minHeight:600}}>
          {detalle.extension==='.pdf'&&(pdfLoad
            ? <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"3rem",color:"var(--color-text-secondary)"}}><i className="ti ti-loader-2 ti-spin" style={{marginRight:8}}/> Cargando PDF...</div>
            : pdfUrl
              ? <iframe src={pdfUrl} style={{width:"100%",height:700,border:"none"}} title={detalle.titulo}/>
              : <div style={{padding:"2rem",textAlign:"center",color:"var(--color-text-secondary)"}}>No se pudo cargar el PDF.</div>
          )}
          {(detalle.extension==='.docx'||detalle.extension==='.doc')&&(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"3rem",gap:16,color:"var(--color-text-secondary)"}}>
              <i className="ti ti-file-type-docx" style={{fontSize:60,color:"var(--color-text-info)"}}/>
              <div style={{fontSize:14,fontWeight:500}}>Archivo Word</div>
              <div style={{fontSize:13,textAlign:"center",maxWidth:320}}>Los archivos DOCX no se pueden previsualizar en el navegador. Descargalo para abrirlo en Word.</div>
              <button onClick={async()=>{const url=await fetchBlobUrl(`/api/escritos/file/${detalle.id}`);const a=document.createElement('a');a.href=url;a.download=detalle.original_name||detalle.titulo+".docx";a.click();URL.revokeObjectURL(url);}}
                style={{fontSize:13,background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)",padding:"8px 20px",display:"flex",alignItems:"center",gap:6}}>
                <i className="ti ti-download"/> Abrir en Word
              </button>
            </div>
          )}
          {detalle.extension==='.txt'&&<TxtViewer id={detalle.id}/>}
        </div>
      </div>
    </div>
  );

  // ── vista de módulos / acordeón ──────────────────────────────
  const anyOpen = groups.some(([m]) => open[m]);

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
        <div>
          <h1 style={{margin:"0 0 2px",fontSize:20,fontWeight:500}}>Escritos Propios</h1>
          <p style={{margin:0,fontSize:13,color:"var(--color-text-secondary)"}}>
            {filtered.length} escrito(s) · {groups.length} materia(s)
          </p>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>anyOpen?collapseAll():expandAll(groups)} style={{fontSize:13,display:"flex",alignItems:"center",gap:5}}>
            <i className={`ti ${anyOpen?"ti-layout-list":"ti-layout-distribute-vertical"}`}/>
            {anyOpen?"Colapsar todo":"Expandir todo"}
          </button>
          <button onClick={()=>setShowUp(true)} style={{fontSize:13,display:"flex",alignItems:"center",gap:6,background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)"}}>
            <i className="ti ti-upload"/> Cargar escrito
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        <select value={areaF} onChange={e=>setAreaF(e.target.value)} style={{fontSize:13}}>
          <option value="">Todas las áreas</option>
          {areas.map(a=><option key={a.id}>{a.nombre}</option>)}
        </select>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar en todos los módulos..." style={{fontSize:13,flex:1,minWidth:220}}/>
      </div>

      {/* Modal de upload */}
      {showUp&&(
        <div style={{position:"fixed",inset:0,zIndex:50,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:40,overflowY:"auto"}}>
          <div style={{background:"var(--color-background-primary)",borderRadius:"var(--border-radius-lg)",border:`0.5px solid ${B}`,padding:"1.5rem",width:580,maxWidth:"95%",margin:"0 auto 40px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
              <h2 style={{margin:0,fontSize:16,fontWeight:500}}>Cargar nuevo escrito</h2>
              <button onClick={()=>setShowUp(false)} style={{border:"none",background:"none",cursor:"pointer",padding:4,fontSize:18}}><i className="ti ti-x"/></button>
            </div>
            <EscritoUploadForm areas={areas} cats={cats} exps={exps}
              onSave={async()=>{setShowUp(false);await onRefresh();}}
              onCancel={()=>setShowUp(false)}/>
          </div>
        </div>
      )}

      {/* Acordeón de materias */}
      {groups.length === 0
        ? <div style={{textAlign:"center",padding:"3rem",color:"var(--color-text-secondary)"}}>
            <i className="ti ti-file-upload" style={{fontSize:48,display:"block",marginBottom:14,opacity:0.5}}/>
            <p style={{margin:"0 0 8px",fontSize:15,fontWeight:500}}>No hay escritos cargados</p>
            <p style={{margin:0,fontSize:13}}>Cargá PDFs, documentos Word o archivos de texto.</p>
          </div>
        : <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {groups.map(([materia, docs]) => {
              const isOpen   = !!open[materia];
              // color del módulo basado en el área más frecuente del grupo
              const topArea  = docs[0]?.area;
              const modColor = topArea ? areaColor(topArea) : "secondary";

              return (
                <div key={materia} style={{borderRadius:"var(--border-radius-lg)",overflow:"hidden",border:`0.5px solid ${B}`}}>
                  {/* Cabecera del módulo */}
                  <button onClick={()=>toggleOpen(materia)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:isOpen?"var(--color-background-primary)":"var(--color-background-secondary)",border:"none",cursor:"pointer",textAlign:"left",borderBottom:isOpen?`0.5px solid ${B}`:"none"}}>
                    <div style={{width:36,height:36,borderRadius:8,background:`var(--color-background-${modColor})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <i className={isOpen?"ti ti-folder-open":"ti ti-folder"} style={{fontSize:18,color:`var(--color-text-${modColor})`}}/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:500}}>{materia}</div>
                      <div style={{fontSize:12,color:"var(--color-text-secondary)",marginTop:1}}>
                        {docs.length} escrito{docs.length!==1?"s":""}
                        {topArea&&materia!==topArea&&<span style={{marginLeft:8,opacity:0.7}}>· {topArea}</span>}
                      </div>
                    </div>
                    <i className={`ti ${isOpen?"ti-chevron-up":"ti-chevron-down"}`} style={{fontSize:16,color:"var(--color-text-secondary)",flexShrink:0}}/>
                  </button>

                  {/* Documentos del módulo */}
                  {isOpen&&(
                    <div style={{background:"var(--color-background-primary)"}}>
                      {docs.map((e, idx) => {
                        const ic  = EXT_ICON[e.extension]  || "ti-file";
                        const ec  = EXT_COLOR[e.extension] || "secondary";
                        return (
                          <div key={e.id} onClick={()=>openDetail(e)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px 10px 20px",borderTop:`0.5px solid ${B}`,cursor:"pointer",transition:"background .1s"}}
                            onMouseEnter={x=>x.currentTarget.style.background="var(--color-background-secondary)"}
                            onMouseLeave={x=>x.currentTarget.style.background="transparent"}>
                            {/* letra del índice */}
                            <div style={{width:20,textAlign:"right",fontSize:11,color:"var(--color-text-secondary)",flexShrink:0,fontFamily:"var(--font-mono)"}}>
                              {String.fromCharCode(65+idx)<="Z"&&docs.length<=26?String.fromCharCode(65+idx):(idx+1)}
                            </div>
                            <div style={{width:28,height:28,borderRadius:6,background:`var(--color-background-${ec})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                              <i className={`ti ${ic}`} style={{fontSize:14,color:`var(--color-text-${ec})`}}/>
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.titulo}</div>
                              {e.descripcion&&<div style={{fontSize:11,color:"var(--color-text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:1}}>{e.descripcion}</div>}
                            </div>
                            <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                              {e.tags&&e.tags.split(",").slice(0,2).map((t,i)=><span key={i} style={{background:"var(--color-background-secondary)",padding:"2px 6px",borderRadius:10,fontSize:10,color:"var(--color-text-secondary)"}}>{t.trim()}</span>)}
                              {e.size_bytes&&<span style={{fontSize:11,color:"var(--color-text-secondary)",minWidth:40,textAlign:"right"}}>{fmtSize(e.size_bytes)}</span>}
                              <span style={{fontSize:11,color:"var(--color-text-secondary)",minWidth:72,textAlign:"right"}}>{e.creado_en?.slice(0,10)}</span>
                              <i className="ti ti-chevron-right" style={{fontSize:13,color:"var(--color-text-secondary)"}}/>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
      }
    </div>
  );
}

// Visor de TXT autenticado
function TxtViewer({ id }) {
  const [text, setText] = useState(null);
  const [err,  setErr]  = useState(null);
  useEffect(() => {
    fetchBlobUrl(`/api/escritos/file/${id}`)
      .then(url => fetch(url).then(r => r.text()).then(t => { setText(t); URL.revokeObjectURL(url); }))
      .catch(() => setErr("No se pudo cargar el archivo"));
  }, [id]);
  if (err)   return <div style={{padding:"2rem",color:"var(--color-text-danger)"}}>{err}</div>;
  if (!text) return <div style={{padding:"2rem",color:"var(--color-text-secondary)"}}><i className="ti ti-loader-2 ti-spin"/> Cargando...</div>;
  return <pre style={{padding:"2rem",fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap",fontFamily:"var(--font-mono)",margin:0,maxHeight:700,overflowY:"auto"}}>{text}</pre>;
}

// Formulario de carga de archivo nuevo
function EscritoUploadForm({ areas, cats, exps, onSave, onCancel }) {
  const [form, setForm] = useState({ titulo:"", area:"", categoria:"", descripcion:"", tags:"", id_expediente:"", notas:"" });
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const EXT = ['.pdf','.docx','.doc','.txt'];

  const handleFile = f => {
    if (!f) return;
    const ext = f.name.slice(f.name.lastIndexOf('.')).toLowerCase();
    if (!EXT.includes(ext)) return setErr(`Extensión no permitida. Solo: ${EXT.join(', ')}`);
    if (f.size > 30*1024*1024) return setErr("El archivo supera los 30 MB");
    setFile(f); setErr("");
    if (!form.titulo) set("titulo", f.name.replace(/\.[^.]+$/, ""));
  };

  const resetInput = () => {
    const inp = document.getElementById("escrito-file-inp");
    if (inp) inp.value = "";
  };

  const doUpload = async () => {
    if (!file)               return setErr("Seleccioná un archivo");
    if (!form.titulo.trim()) return setErr("Ingresá un título");
    setLoading(true); setErr("");
    const fd = new FormData();
    fd.append("archivo", file);
    Object.entries(form).forEach(([k,v]) => { if (v) fd.append(k, v); });
    try { await uploadFile("/api/escritos/upload", fd); await onSave(); }
    catch(e) { setErr(e.message || "Error al subir"); }
    setLoading(false);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {/* Drop zone */}
      <div
        onDragOver={e=>{e.preventDefault();setDrag(true);}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}}
        onClick={()=>document.getElementById("escrito-file-inp").click()}
        style={{border:`2px dashed ${drag?"var(--color-border-info)":B}`,borderRadius:"var(--border-radius-lg)",padding:"1.5rem",textAlign:"center",cursor:"pointer",background:drag?"var(--color-background-info)":"var(--color-background-secondary)",transition:"all .15s"}}>
        <input
          id="escrito-file-inp" type="file" accept=".pdf,.docx,.doc,.txt"
          style={{display:"none"}}
          onClick={e=>e.stopPropagation()}
          onChange={e=>handleFile(e.target.files[0])}
        />
        {file
          ? <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
              <i className="ti ti-file-check" style={{fontSize:32,color:"var(--color-text-success)"}}/>
              <div style={{fontSize:14,fontWeight:500}}>{file.name}</div>
              <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{(file.size/1024).toFixed(0)} KB</div>
              <button onClick={e=>{e.stopPropagation();setFile(null);resetInput();}} style={{fontSize:12,marginTop:4}}>
                Cambiar archivo
              </button>
            </div>
          : <div>
              <i className="ti ti-upload" style={{fontSize:32,color:"var(--color-text-secondary)",display:"block",marginBottom:8}}/>
              <div style={{fontSize:14,fontWeight:500,marginBottom:4}}>Arrastrá el archivo o hacé click</div>
              <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>PDF, DOCX, DOC, TXT — máximo 30 MB</div>
            </div>
        }
      </div>

      <Campo label="Título *">
        <input value={form.titulo} onChange={e=>set("titulo",e.target.value)} style={{width:"100%",marginTop:4}} placeholder="Nombre descriptivo del documento"/>
      </Campo>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <Campo label="Área">
          <select value={form.area} onChange={e=>set("area",e.target.value)} style={{width:"100%",marginTop:4}}>
            <option value="">— Sin área —</option>
            {areas.map(a=><option key={a.id}>{a.nombre}</option>)}
          </select>
        </Campo>
        <Campo label="Materia / Categoría">
          <input value={form.categoria} onChange={e=>set("categoria",e.target.value)} style={{width:"100%",marginTop:4}} list="cats-list" placeholder="Ej: Contratos, Demandas..."/>
          <datalist id="cats-list">{cats.map((c,i)=><option key={i} value={c}/>)}</datalist>
        </Campo>
      </div>
      <Campo label="Expediente relacionado">
        <select value={form.id_expediente} onChange={e=>set("id_expediente",e.target.value)} style={{width:"100%",marginTop:4}}>
          <option value="">— Sin expediente —</option>
          {exps.map(e=><option key={e.id} value={e.id}>{e.numero} · {e.caratula}</option>)}
        </select>
      </Campo>
      <Campo label="Descripción">
        <textarea value={form.descripcion} onChange={e=>set("descripcion",e.target.value)} rows={2} style={{width:"100%",marginTop:4}}/>
      </Campo>
      <Campo label="Tags (separados por coma)">
        <input value={form.tags} onChange={e=>set("tags",e.target.value)} style={{width:"100%",marginTop:4}} placeholder="contrato, locación, rescisión"/>
      </Campo>
      <Campo label="Notas internas">
        <textarea value={form.notas} onChange={e=>set("notas",e.target.value)} rows={2} style={{width:"100%",marginTop:4,fontSize:12}}/>
      </Campo>
      {err&&<div style={{color:"var(--color-text-danger)",fontSize:13,padding:"6px 10px",background:"var(--color-background-danger)",borderRadius:6}}>{err}</div>}
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:4}}>
        <button onClick={onCancel} disabled={loading}>Cancelar</button>
        <button onClick={doUpload} disabled={loading||!file} style={{background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)",display:"flex",alignItems:"center",gap:6}}>
          {loading?<><i className="ti ti-loader-2 ti-spin"/> Subiendo...</>:<><i className="ti ti-upload"/> Subir escrito</>}
        </button>
      </div>
    </div>
  );
}

// Formulario de edición de metadata (sin reemplazar archivo)
function EscritoMetaForm({ initial, areas, cats, exps, onSave, onCancel }) {
  const [form, setForm] = useState({
    titulo:        initial.titulo        || "",
    area:          initial.area          || "",
    categoria:     initial.categoria     || "",
    descripcion:   initial.descripcion   || "",
    tags:          initial.tags          || "",
    id_expediente: initial.id_expediente || "",
    notas:         initial.notas         || "",
  });
  const [loading, setLoading] = useState(false);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const doSave = async () => { setLoading(true); try { await onSave(form); } catch(e) { alert(e.message); } setLoading(false); };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <Campo label="Título *">
        <input value={form.titulo} onChange={e=>set("titulo",e.target.value)} style={{width:"100%",marginTop:4}}/>
      </Campo>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <Campo label="Área">
          <select value={form.area} onChange={e=>set("area",e.target.value)} style={{width:"100%",marginTop:4}}>
            <option value="">— Sin área —</option>
            {areas.map(a=><option key={a.id}>{a.nombre}</option>)}
          </select>
        </Campo>
        <Campo label="Materia / Categoría">
          <input value={form.categoria} onChange={e=>set("categoria",e.target.value)} style={{width:"100%",marginTop:4}} list="cats-list-meta"/>
          <datalist id="cats-list-meta">{cats.map((c,i)=><option key={i} value={c}/>)}</datalist>
        </Campo>
      </div>
      <Campo label="Expediente">
        <select value={form.id_expediente} onChange={e=>set("id_expediente",e.target.value)} style={{width:"100%",marginTop:4}}>
          <option value="">— Sin expediente —</option>
          {exps.map(e=><option key={e.id} value={e.id}>{e.numero} · {e.caratula}</option>)}
        </select>
      </Campo>
      <Campo label="Descripción">
        <textarea value={form.descripcion} onChange={e=>set("descripcion",e.target.value)} rows={2} style={{width:"100%",marginTop:4}}/>
      </Campo>
      <Campo label="Tags">
        <input value={form.tags} onChange={e=>set("tags",e.target.value)} style={{width:"100%",marginTop:4}}/>
      </Campo>
      <Campo label="Notas">
        <textarea value={form.notas} onChange={e=>set("notas",e.target.value)} rows={2} style={{width:"100%",marginTop:4,fontSize:12}}/>
      </Campo>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
        <button onClick={onCancel} disabled={loading}>Cancelar</button>
        <button onClick={doSave} disabled={loading||!form.titulo} style={{background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)"}}>
          {loading?<i className="ti ti-loader-2 ti-spin"/>:"Guardar"}
        </button>
      </div>
    </div>
  );
}


// ── Login ─────────────────────────────────────────────────────
function LoginScreen({onLogin}) {
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const doLogin=async()=>{
    if(!email||!pass)return setErr("Completa todos los campos");
    setLoading(true);setErr("");
    try{const data=await api.post("/api/auth/login",{email,password:pass});localStorage.setItem("token",data.token);onLogin(data.user);}
    catch(e){setErr(e.message||"Credenciales invalidas");}
    setLoading(false);
  };
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--color-background-tertiary)"}}>
      <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"2rem 2.5rem",width:380}}>
        <div style={{textAlign:"center",marginBottom:"1.75rem"}}>
          <div style={{width:52,height:52,borderRadius:14,background:"var(--color-background-info)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
            <i className="ti ti-gavel" style={{fontSize:26,color:"var(--color-text-info)"}}/>
          </div>
          <h1 style={{margin:"0 0 4px",fontSize:20,fontWeight:500}}>Estudio Juridico</h1>
          <p style={{margin:0,fontSize:13,color:"var(--color-text-secondary)"}}>Sistema de Gestion</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Campo label="Email"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="usuario@estudio.com" style={{width:"100%",marginTop:4}}/></Campo>
          <Campo label="Contrasena"><input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} style={{width:"100%",marginTop:4}}/></Campo>
          <Err msg={err}/>
          <button onClick={doLogin} disabled={loading} style={{width:"100%",background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)",padding:"9px",fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {loading?<><Spinner/> Ingresando...</>:"Ingresar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ModeloViewer ──────────────────────────────────────────────
function ModeloViewer({modelo,vars,setVars,onBack}) {
  const [copied,setCopied]=useState(false);
  const render=()=>{
    let t=modelo.contenido||"";
    (modelo.variables||[]).forEach(v=>{t=t.replaceAll(`{{${v.campo}}}`,vars[v.campo]||`[${v.label}]`);});
    return t;
  };
  const copy=async()=>{try{await navigator.clipboard.writeText(render());setCopied(true);setTimeout(()=>setCopied(false),2000);}catch{alert("No se pudo copiar");}};
  const print=()=>{const w=window.open("","_blank");w.document.write(`<html><head><title>${modelo.nombre}</title><style>body{font-family:Times New Roman,serif;font-size:12pt;line-height:1.8;margin:3cm;white-space:pre-wrap}</style></head><body>${render().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</body></html>`);w.document.close();w.print();};
  return (
    <div>
      <button onClick={onBack} style={{marginBottom:"1rem",fontSize:13,display:"flex",alignItems:"center",gap:5}}><i className="ti ti-arrow-left" style={{fontSize:14}}/> Volver</button>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem",flexWrap:"wrap",gap:8}}>
        <div><h1 style={{margin:"0 0 4px",fontSize:18,fontWeight:500}}>{modelo.nombre}</h1><span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{modelo.categoria_nombre}</span></div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={copy} style={{fontSize:13,display:"flex",alignItems:"center",gap:5}}><i className={`ti ${copied?"ti-check":"ti-copy"}`}/>{copied?"Copiado!":"Copiar"}</button>
          <button onClick={print} style={{fontSize:13,display:"flex",alignItems:"center",gap:5,background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)"}}><i className="ti ti-printer"/> Imprimir</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:modelo.variables?.length?"320px 1fr":"1fr",gap:14,alignItems:"flex-start"}}>
        {modelo.variables?.length>0&&(
          <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1rem",position:"sticky",top:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <h3 style={{margin:0,fontSize:14,fontWeight:500}}>Completar datos</h3>
              <button onClick={()=>setVars({})} style={{fontSize:11,color:"var(--color-text-secondary)"}}>Limpiar</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {modelo.variables.map(v=>(
                <Campo key={v.campo} label={v.label}>
                  {v.tipo==="textarea"
                    ?<textarea value={vars[v.campo]||""} onChange={e=>setVars(p=>({...p,[v.campo]:e.target.value}))} rows={3} style={{width:"100%",fontSize:12,marginTop:4}}/>
                    :<input type={v.tipo||"text"} value={vars[v.campo]||""} onChange={e=>setVars(p=>({...p,[v.campo]:e.target.value}))} style={{width:"100%",fontSize:12,marginTop:4}}/>}
                </Campo>
              ))}
            </div>
          </div>
        )}
        <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"2.5rem",fontFamily:"'Times New Roman',Georgia,serif",fontSize:13,lineHeight:1.9,whiteSpace:"pre-wrap",minHeight:400}}>
          {render()}
        </div>
      </div>
    </div>
  );
}

// ── App principal ─────────────────────────────────────────────
export default function App() {
  const [user,setUser]=useState(()=>{
    const t=localStorage.getItem("token");
    if(!t)return null;
    try{const p=JSON.parse(atob(t.split(".")[1]));if(p.exp&&p.exp*1000<Date.now()){localStorage.removeItem("token");return null;}return p;}
    catch{localStorage.removeItem("token");return null;}
  });
  const [view,setView]=useState("dashboard");
  const [areas,setAreas]=useState([]);
  const [abogados,setAbogados]=useState([]);
  const [clientes,setClientes]=useState([]);
  const [exps,setExps]=useState([]);
  const [contrapartes,setContrapartes]=useState([]);
  const [doctrina,setDoctrina]=useState([]);
  const [jurisprudencia,setJurisprudencia]=useState([]);
  const [leyes,setLeyes]=useState([]);
  const [juzgados,setJuzgados]=useState([]);
  const [modelos,setModelos]=useState([]);
  const [categorias,setCategorias]=useState([]);
  const [escritos,setEscritos]=useState([]);
  const [escritosCats,setEscriitosCats]=useState([]);
  const [modal,setModal]=useState(null);
  const [detail,setDetail]=useState(null);
  const [loading,setLoading]=useState(false);
  const [mLoading,setMLoading]=useState(false);
  const [mErr,setMErr]=useState("");
  const [exporting,setExporting]=useState(false);
  // filtros
  const [expAreaF,setExpAreaF]=useState("todas");
  const [expEstadoF,setExpEstadoF]=useState("todos");
  const [cpFiltro,setCpFiltro]=useState("todos");
  const [docAreaF,setDocAreaF]=useState("");
  const [docQ,setDocQ]=useState("");
  const [jurisAreaF,setJurisAreaF]=useState("");
  const [jurisQ,setJurisQ]=useState("");
  const [leyAreaF,setLeyAreaF]=useState("");
  const [leyTipoF,setLeyTipoF]=useState("");
  const [leyQ,setLeyQ]=useState("");
  const [juzgFuero,setJuzgFuero]=useState("todos");
  const [juzgQ,setJuzgQ]=useState("");
  const [modeloTipo,setModeloTipo]=useState("todos");
  const [modeloCat,setModeloCat]=useState("todas");
  const [modeloSelec,setModeloSelec]=useState(null);
  const [modeloVars,setModeloVars]=useState({});
  const [clienteTipo,setClienteTipo]=useState("todos");
  const [searchQ,setSearchQ]=useState("");
  const [searchType,setSearchType]=useState("jurisprudencia");
  const [searchRes,setSearchRes]=useState(null);
  const [searching,setSearching]=useState(false);

  const canEdit  = user?.rol !== "abogado";
  const isAdmin  = ["administrador","socio"].includes(user?.rol);
  const areaColor= useCallback(nombre=>(areas.find(x=>x.nombre===nombre)?.color||"secondary"),[areas]);

  const loadData=useCallback(async()=>{
    if(!user)return;
    setLoading(true);
    try{
      const [ar,ab,cl,ex,cp,jz,md,cat,doc,juris,ley,esc,escCats]=await Promise.all([
        api.get("/api/areas"),
        api.get("/api/abogados"),
        api.get("/api/clientes"),
        api.get("/api/expedientes"),
        api.get("/api/contrapartes"),
        api.get("/api/juzgados"),
        api.get("/api/modelos"),
        api.get("/api/modelos/categorias"),
        api.get("/api/doctrina"),
        api.get("/api/jurisprudencia"),
        api.get("/api/leyes"),
        api.get("/api/escritos"),
        api.get("/api/escritos/categorias"),
      ]);
      setAreas(ar);setAbogados(ab);setClientes(cl);setExps(ex);
      setContrapartes(cp);setJuzgados(jz);setModelos(md);setCategorias(cat);
      setDoctrina(doc);setJurisprudencia(juris);setLeyes(ley);
      setEscritos(esc);setEscriitosCats(escCats);
    }catch(e){console.error("[loadData]",e);}
    setLoading(false);
  },[user]);

  useEffect(()=>{loadData();},[loadData]);

  const saveModal=async(data)=>{
    setMLoading(true);setMErr("");
    const ROUTES={expediente:"expedientes",cliente:"clientes",abogado:"abogados",
                  contraparte:"contrapartes",doctrina:"doctrina",jurisprudencia:"jurisprudencia",
                  ley:"leyes",area:"areas",escrito_meta:"escritos"};
    const path=ROUTES[modal.type];
    if(!path)return setMErr("Tipo desconocido");
    try{
      if(modal.mode==="new") await api.post(`/api/${path}`,data);
      else await api.put(`/api/${path}/${data.id}`,data);
      setModal(null);await loadData();
    }catch(e){setMErr(e.message||"Error al guardar");}
    setMLoading(false);
  };

  const doDelete=async(type,id)=>{
    if(!window.confirm("Confirmar eliminacion?"))return;
    try{await api.delete(`/api/${type}/${id}`);await loadData();if(detail?.id===id)setDetail(null);}
    catch(e){alert(e.message||"Error al eliminar");}
  };

  const doSearch=async()=>{
    if(!searchQ.trim())return;
    setSearching(true);setSearchRes(null);
    try{
      const resp=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:2000,
          system:"Eres asistente juridico argentino. Responde SOLO JSON valido, sin backticks.",
          tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{role:"user",content:`Busca informacion sobre: "${searchQ}" en ${searchType==="jurisprudencia"?"jurisprudencia argentina (fallos CSJN y Camaras)":searchType==="doctrina"?"doctrina juridica argentina":"legislacion argentina vigente"}. Devuelve JSON con estructura: {"titulo":"...","resultados":[{"titulo":"...","referencia":"...","fecha":"...","resumen":"...","relevancia":"alta|media"}],"nota":"..."}`}]
        })
      });
      const d=await resp.json();
      const txt=d.content?.find(b=>b.type==="text")?.text||"";
      try{setSearchRes(JSON.parse(txt.replace(/```json|```/g,"").trim()));}
      catch{setSearchRes({titulo:searchQ,resultados:[],nota:txt,raw:true});}
    }catch{setSearchRes({error:"Error de conexion con la API."});}
    setSearching(false);
  };

  const doExport=async(path,filename)=>{setExporting(true);try{await descargar(path,filename);}catch(e){alert("Error: "+e.message);}setExporting(false);};
  const navigate=(v)=>{setView(v);setDetail(null);setModeloSelec(null);};

  if(!user)return <LoginScreen onLogin={u=>{setUser(u);}}/>;

  const activeExps   =exps.filter(e=>e.estado==="activo");
  const upcoming     =[...activeExps].filter(e=>e.prox_fecha).sort((a,b)=>a.prox_fecha.localeCompare(b.prox_fecha)).slice(0,6);
  const filtExps     =exps.filter(e=>(expAreaF==="todas"||e.area===expAreaF)&&(expEstadoF==="todos"||e.estado===expEstadoF));
  const filtCli      =clientes.filter(c=>clienteTipo==="todos"||c.tipo===clienteTipo);
  const filtCp       =contrapartes.filter(c=>cpFiltro==="todos"||c.tipo===cpFiltro);
  const filtDoc      =doctrina.filter(d=>(!docAreaF||d.area===docAreaF)&&(!docQ||(d.titulo+d.autor).toLowerCase().includes(docQ.toLowerCase())));
  const filtJuris    =jurisprudencia.filter(j=>(!jurisAreaF||j.area===jurisAreaF)&&(!jurisQ||(j.caratula+j.tema).toLowerCase().includes(jurisQ.toLowerCase())));
  const filtLeyes    =leyes.filter(l=>(!leyAreaF||l.area===leyAreaF)&&(!leyTipoF||l.tipo===leyTipoF)&&(!leyQ||(l.nombre+l.numero).toLowerCase().includes(leyQ.toLowerCase())));
  const filtJuzg     =juzgados.filter(j=>(juzgFuero==="todos"||j.fuero===juzgFuero)&&(!juzgQ||[j.nombre,j.nombre_juez||""].join(" ").toLowerCase().includes(juzgQ.toLowerCase())));
  const filtModelos  =modelos.filter(m=>(modeloTipo==="todos"||m.categoria_tipo===modeloTipo)&&(modeloCat==="todas"||String(m.id_categoria)===modeloCat));

  const openModal=(type,mode,title,data=null)=>setModal({type,mode,title,data});
  const btnNew=(type,title,data)=><button onClick={()=>openModal(type,"new",title,data)} style={{fontSize:13,display:"flex",alignItems:"center",gap:6,background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)"}}><i className="ti ti-plus"/> Nuevo</button>;
  const btnBack=()=><button onClick={()=>setDetail(null)} style={{fontSize:13,display:"flex",alignItems:"center",gap:5,marginBottom:"1rem"}}><i className="ti ti-arrow-left" style={{fontSize:14}}/> Volver</button>;
  const pageHead=(title,right)=><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}><h1 style={{margin:0,fontSize:20,fontWeight:500}}>{title}</h1><div style={{display:"flex",gap:8}}>{right}</div></div>;
  const filterBar=(...els)=><div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>{els.map((el,i)=>el?<span key={i} style={{display:"contents"}}>{el}</span>:null)}</div>;
  const tabBar=(opts,val,set)=><div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>{opts.map(([v,l])=><button key={v} onClick={()=>set(v)} style={{fontSize:13,background:val===v?"var(--color-background-info)":"var(--color-background-secondary)",color:val===v?"var(--color-text-info)":"var(--color-text-secondary)",border:val===v?"0.5px solid var(--color-border-info)":`0.5px solid ${B}`,borderRadius:20,padding:"4px 14px",cursor:"pointer"}}>{l}</button>)}</div>;
  const card=(children,extra={})=><div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",overflow:"hidden",...extra}}>{children}</div>;

  const TH=({children,w})=><th style={{padding:"10px 12px",textAlign:"left",fontWeight:500,borderBottom:`0.5px solid ${B}`,width:w}}>{children}</th>;
  const TD=({children,style={}})=><td style={{padding:"10px 12px",...style}}>{children}</td>;

  return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"var(--font-sans)"}}>
      {/* MODAL */}
      {modal&&(
        <Modal title={modal.title} onClose={()=>setModal(null)} wide={["contraparte","doctrina","jurisprudencia","ley"].includes(modal.type)}>
          {mErr&&<Err msg={mErr}/>}
          {modal.type==="expediente"&&<ExpForm initial={modal.data} abogados={abogados} clientes={clientes} areas={areas} onSave={saveModal} onCancel={()=>setModal(null)} loading={mLoading}/>}
          {modal.type==="cliente"&&<ClienteForm initial={modal.data} areas={areas} onSave={saveModal} onCancel={()=>setModal(null)} loading={mLoading}/>}
          {modal.type==="abogado"&&<AbogadoForm initial={modal.data} onSave={saveModal} onCancel={()=>setModal(null)} loading={mLoading}/>}
          {modal.type==="contraparte"&&<ContraparteForm initial={modal.data} areas={areas} onSave={saveModal} onCancel={()=>setModal(null)} loading={mLoading}/>}
          {modal.type==="doctrina"&&<DoctriinaForm initial={modal.data} areas={areas} onSave={saveModal} onCancel={()=>setModal(null)} loading={mLoading}/>}
          {modal.type==="jurisprudencia"&&<JurisprudenciaForm initial={modal.data} areas={areas} onSave={saveModal} onCancel={()=>setModal(null)} loading={mLoading}/>}
          {modal.type==="ley"&&<LeyForm initial={modal.data} areas={areas} onSave={saveModal} onCancel={()=>setModal(null)} loading={mLoading}/>}
          {modal.type==="area"&&<AreaForm initial={modal.data} onSave={saveModal} onCancel={()=>setModal(null)} loading={mLoading}/>}
        </Modal>
      )}

      {/* SIDEBAR */}
      <nav style={{width:204,background:"var(--color-background-secondary)",borderRight:`0.5px solid ${B}`,display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}>
        <div style={{padding:"1.25rem 1rem 1rem",borderBottom:`0.5px solid ${B}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:32,height:32,borderRadius:8,background:"var(--color-background-info)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <i className="ti ti-gavel" style={{fontSize:17,color:"var(--color-text-info)"}}/>
            </div>
            <div><div style={{fontSize:13,fontWeight:500,lineHeight:1.2}}>Estudio Juridico</div><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Sistema de Gestion</div></div>
          </div>
        </div>
        <div style={{flex:1,padding:"0.5rem 0"}}>
          {NAV.map(n=>{
            const active=view===n.id;
            return <button key={n.id} onClick={()=>navigate(n.id)} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"7px 12px",background:active?"var(--color-background-primary)":"none",border:"none",borderLeft:active?"2px solid var(--color-border-info)":"2px solid transparent",cursor:"pointer",textAlign:"left",color:active?"var(--color-text-primary)":"var(--color-text-secondary)",fontSize:12.5,fontWeight:active?500:400}}>
              <i className={`ti ${n.icon}`} style={{fontSize:15}}/>{n.label}
            </button>;
          })}
        </div>
        <div style={{padding:"0.75rem 1rem",borderTop:`0.5px solid ${B}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <Avatar name={user.nombre||user.email} size={28} color="info"/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(user.nombre||user.email).replace(/^Dr[a]?\.?\s+/i,"")}</div>
              <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{ROL_LABEL[user.rol]||user.rol}</div>
            </div>
          </div>
          <button onClick={()=>{localStorage.removeItem("token");setUser(null);}} style={{width:"100%",fontSize:12,display:"flex",alignItems:"center",gap:6,color:"var(--color-text-secondary)",border:`0.5px solid ${B}`,padding:"5px 8px",background:"none"}}>
            <i className="ti ti-logout" style={{fontSize:13}}/>Cerrar sesion
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main style={{flex:1,overflowY:"auto",minWidth:0,padding:"1.5rem"}}>
        {loading&&<div style={{textAlign:"center",padding:"3rem",color:"var(--color-text-secondary)"}}><Spinner/> Cargando...</div>}

        {/* ── DASHBOARD ── */}
        {!loading&&view==="dashboard"&&(
          <div>
            {pageHead("Panel General")}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:"1.5rem"}}>
              {[{label:"Expedientes activos",val:activeExps.length,icon:"ti-folder-open",c:"info"},
                {label:"Clientes actuales",val:clientes.filter(c=>c.tipo==="actual").length,icon:"ti-users",c:"success"},
                {label:"Contrapartes",val:contrapartes.length,icon:"ti-user-x",c:"warning"},
                {label:"Abogados activos",val:abogados.filter(a=>a.activo).length,icon:"ti-user-circle",c:"secondary"},
              ].map(s=><div key={s.label} style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"0.875rem 1rem",border:`0.5px solid ${B}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{s.label}</span>
                  <i className={`ti ${s.icon}`} style={{fontSize:16,color:`var(--color-text-${s.c})`}}/>
                </div>
                <div style={{fontSize:26,fontWeight:500}}>{s.val}</div>
              </div>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {card(<div style={{padding:"1rem 1.25rem"}}>
                <h3 style={{margin:"0 0 1rem",fontSize:14,fontWeight:500}}>Proximas fechas</h3>
                {upcoming.length===0&&<p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>Sin fechas registradas</p>}
                {upcoming.map((e,i)=><div key={e.id} style={{borderBottom:i<upcoming.length-1?`0.5px solid ${B}`:"none",paddingBottom:10,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
                    <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.caratula}</div><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{e.abogado_nombre?.replace(/^Dr[a]?\.?\s+/i,"")||"—"}</div></div>
                    <div style={{flexShrink:0,textAlign:"right"}}><div style={{fontSize:12,fontWeight:500,color:"var(--color-text-warning)"}}>{e.prox_fecha?.slice(0,10)}</div><AreaBadge area={e.area} color={areaColor(e.area)}/></div>
                  </div>
                </div>)}
              </div>)}
              {card(<div style={{padding:"1rem 1.25rem"}}>
                <h3 style={{margin:"0 0 1rem",fontSize:14,fontWeight:500}}>Expedientes por area</h3>
                {areas.map(a=>{const cnt=activeExps.filter(e=>e.area===a.nombre).length;const pct=Math.round((cnt/(activeExps.length||1))*100);return(
                  <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <span style={{fontSize:12,width:90,flexShrink:0}}>{a.nombre}</span>
                    <div style={{flex:1,background:"var(--color-background-secondary)",borderRadius:4,height:8}}><div style={{width:`${pct}%`,height:"100%",borderRadius:4,background:`var(--color-text-${a.color||"secondary"})`,opacity:0.7}}/></div>
                    <span style={{fontSize:12,fontWeight:500,width:22,textAlign:"right"}}>{cnt}</span>
                  </div>
                );})}
              </div>)}
            </div>
          </div>
        )}

        {/* ── AREAS ── */}
        {!loading&&view==="areas"&&!detail&&(
          <div>
            {pageHead("Areas del Estudio",
              isAdmin&&<button onClick={()=>openModal("area","new","Nueva Area de Practica")} style={{fontSize:13,display:"flex",alignItems:"center",gap:6,background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)"}}><i className="ti ti-plus"/> Nueva Area</button>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {areas.map(a=>{
                const cnt=activeExps.filter(e=>e.area===a.nombre).length;
                const c=a.color||"secondary";
                return <div key={a.id} style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.25rem",cursor:"pointer",transition:"border-color .15s"}}
                  onClick={()=>setDetail(a)}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=`var(--color-border-${c})`}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=B}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{width:40,height:40,borderRadius:"var(--border-radius-md)",background:`var(--color-background-${c})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <i className={`ti ${a.icon||"ti-books"}`} style={{fontSize:20,color:`var(--color-text-${c})`}}/>
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <span style={{background:`var(--color-background-${c})`,color:`var(--color-text-${c})`,fontSize:12,fontWeight:500,padding:"3px 10px",borderRadius:20}}>{cnt} activos</span>
                      {isAdmin&&<button onClick={e=>{e.stopPropagation();openModal("area","edit","Editar Area",a);}} style={{padding:"4px 6px",fontSize:11}} title="Editar"><i className="ti ti-edit"/></button>}
                    </div>
                  </div>
                  <div style={{fontSize:15,fontWeight:500,marginBottom:6}}>{a.nombre}</div>
                  <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.5}}>{a.descripcion}</div>
                </div>;
              })}
            </div>
          </div>
        )}
        {!loading&&view==="areas"&&detail&&(
          <div>
            {btnBack()}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}>
              <div style={{width:44,height:44,borderRadius:"var(--border-radius-md)",background:`var(--color-background-${detail.color||"secondary"})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <i className={`ti ${detail.icon||"ti-books"}`} style={{fontSize:22,color:`var(--color-text-${detail.color||"secondary"})`}}/>
              </div>
              <div><h1 style={{margin:"0 0 2px",fontSize:20,fontWeight:500}}>{detail.nombre}</h1><p style={{margin:0,fontSize:13,color:"var(--color-text-secondary)"}}>{detail.descripcion}</p></div>
            </div>
            {card(<table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{background:"var(--color-background-secondary)"}}><TH w="12%">Numero</TH><TH w="35%">Caratula</TH><TH w="11%">Estado</TH><TH w="22%">Abogado</TH><TH w="14%">Prox. fecha</TH></tr></thead>
              <tbody>{exps.filter(e=>e.area===detail.nombre).map((e,i,arr)=><tr key={e.id} style={{borderBottom:i<arr.length-1?`0.5px solid ${B}`:"none"}}>
                <TD style={{fontSize:12,color:"var(--color-text-secondary)",fontFamily:"var(--font-mono)"}}>{e.numero}</TD>
                <TD style={{fontWeight:500}}>{e.caratula}</TD>
                <TD><Badge v={e.estado}/></TD>
                <TD style={{fontSize:12}}>{e.abogado_nombre?.replace(/^Dr[a]?\.?\s+/i,"")||"—"}</TD>
                <TD style={{fontSize:12,color:"var(--color-text-warning)"}}>{e.prox_fecha?.slice(0,10)||"—"}</TD>
              </tr>)}</tbody>
            </table>)}
          </div>
        )}

        {/* ── EXPEDIENTES ── */}
        {!loading&&view==="expedientes"&&!detail&&(
          <div>
            {pageHead("Expedientes",<>
              <button onClick={()=>doExport("/api/exportar/expedientes/pdf","expedientes.pdf")} disabled={exporting} style={{fontSize:13,display:"flex",alignItems:"center",gap:5,color:"var(--color-text-danger)",border:"0.5px solid var(--color-border-danger)",background:"var(--color-background-danger)"}}><i className="ti ti-file-type-pdf"/> PDF</button>
              <button onClick={()=>doExport("/api/exportar/expedientes/excel","expedientes.xlsx")} disabled={exporting} style={{fontSize:13,display:"flex",alignItems:"center",gap:5,color:"var(--color-text-success)",border:"0.5px solid var(--color-border-success)",background:"var(--color-background-success)"}}><i className="ti ti-file-type-xls"/> Excel</button>
              {canEdit&&btnNew("expediente","Nuevo Expediente")}
            </>)}
            {filterBar(
              <select value={expAreaF} onChange={e=>setExpAreaF(e.target.value)} style={{fontSize:13}}><option value="todas">Todas las areas</option>{areas.map(a=><option key={a.id}>{a.nombre}</option>)}</select>,
              <select value={expEstadoF} onChange={e=>setExpEstadoF(e.target.value)} style={{fontSize:13}}><option value="todos">Todos los estados</option><option value="activo">Activos</option><option value="cerrado">Cerrados</option><option value="suspendido">Suspendidos</option></select>,
              <span style={{fontSize:13,color:"var(--color-text-secondary)",alignSelf:"center"}}>{filtExps.length} expediente(s)</span>
            )}
            {card(<table style={{width:"100%",borderCollapse:"collapse",fontSize:13,tableLayout:"fixed"}}>
              <thead><tr style={{background:"var(--color-background-secondary)"}}><TH w="11%">Numero</TH><TH w="30%">Caratula</TH><TH w="11%">Area</TH><TH w="10%">Estado</TH><TH w="18%">Abogado</TH><TH w="11%">Prox. fecha</TH><TH w="5%"></TH></tr></thead>
              <tbody>{filtExps.map((e,i)=><tr key={e.id} style={{borderBottom:i<filtExps.length-1?`0.5px solid ${B}`:"none"}}>
                <TD style={{fontSize:11,color:"var(--color-text-secondary)",fontFamily:"var(--font-mono)"}}>{e.numero}</TD>
                <TD><div style={{fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.caratula}</div><div style={{fontSize:11,color:"var(--color-text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.juzgado}</div></TD>
                <TD><AreaBadge area={e.area} color={areaColor(e.area)}/></TD>
                <TD><Badge v={e.estado}/></TD>
                <TD style={{fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.abogado_nombre?.replace(/^Dr[a]?\.?\s+/i,"")||"—"}</TD>
                <TD style={{fontSize:12,color:e.prox_fecha?"var(--color-text-warning)":"var(--color-text-secondary)"}}>{e.prox_fecha?.slice(0,10)||"—"}</TD>
                <TD><div style={{display:"flex",gap:3,justifyContent:"center"}}>
                  <button onClick={()=>setDetail(e)} style={{padding:"3px 6px",fontSize:11}} title="Ver"><i className="ti ti-eye"/></button>
                  {canEdit&&<button onClick={()=>openModal("expediente","edit","Editar Expediente",e)} style={{padding:"3px 6px",fontSize:11}} title="Editar"><i className="ti ti-edit"/></button>}
                </div></TD>
              </tr>)}</tbody>
            </table>)}
          </div>
        )}
        {!loading&&view==="expedientes"&&detail&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1.25rem"}}>
              {btnBack()}
              {canEdit&&<button onClick={()=>openModal("expediente","edit","Editar Expediente",detail)}><i className="ti ti-edit"/> Editar</button>}
            </div>
            <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.5rem",borderLeft:`3px solid var(--color-border-${areaColor(detail.area)})`}}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:16}}>
                <div><div style={{fontSize:12,color:"var(--color-text-secondary)",fontFamily:"var(--font-mono)",marginBottom:4}}>{detail.numero}</div><h2 style={{margin:0,fontSize:17,fontWeight:500}}>{detail.caratula}</h2></div>
                <div style={{display:"flex",gap:8}}><AreaBadge area={detail.area} color={areaColor(detail.area)}/><Badge v={detail.estado}/></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,borderTop:`0.5px solid ${B}`,paddingTop:16}}>
                <DetailRow label="Juzgado / Organismo" value={detail.juzgado}/>
                <DetailRow label="Fecha apertura" value={detail.apertura?.slice(0,10)}/>
                <DetailRow label="Proxima fecha" value={detail.prox_fecha?.slice(0,10)}/>
                <DetailRow label="Abogado" value={detail.abogado_nombre}/>
                <DetailRow label="Cliente" value={detail.cliente_razon}/>
              </div>
              {detail.notas&&<div style={{marginTop:16,borderTop:`0.5px solid ${B}`,paddingTop:14}}><DetailRow label="Notas" value={detail.notas}/></div>}
            </div>
          </div>
        )}

        {/* ── CLIENTES ── */}
        {!loading&&view==="clientes"&&(
          <div>
            {pageHead("Clientes",<>
              <button onClick={()=>doExport("/api/exportar/clientes/excel","clientes.xlsx")} disabled={exporting} style={{fontSize:13,display:"flex",alignItems:"center",gap:5,color:"var(--color-text-success)",border:"0.5px solid var(--color-border-success)",background:"var(--color-background-success)"}}><i className="ti ti-file-type-xls"/> Excel</button>
              {isAdmin&&btnNew("cliente","Nuevo Cliente")}
            </>)}
            {tabBar([["todos","Todos"],["actual","Actuales"],["potencial","Potenciales"]],clienteTipo,setClienteTipo)}
            {card(<table style={{width:"100%",borderCollapse:"collapse",fontSize:13,tableLayout:"fixed"}}>
              <thead><tr style={{background:"var(--color-background-secondary)"}}><TH w="28%">Razon social</TH><TH w="10%">Tipo</TH><TH w="12%">Area</TH><TH w="18%">Contacto</TH><TH w="24%">Email</TH><TH w="8%"></TH></tr></thead>
              <tbody>{filtCli.map((c,i)=><tr key={c.id} style={{borderBottom:i<filtCli.length-1?`0.5px solid ${B}`:"none"}}>
                <TD><div style={{fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.razon}</div>{c.cuit&&<div style={{fontSize:11,color:"var(--color-text-secondary)"}}>CUIT {c.cuit}</div>}</TD>
                <TD><Badge v={c.tipo}/></TD>
                <TD>{c.area&&<AreaBadge area={c.area} color={areaColor(c.area)}/>}</TD>
                <TD style={{fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.contacto||"—"}</TD>
                <TD style={{fontSize:12,color:"var(--color-text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.email||"—"}</TD>
                <TD>{isAdmin&&<button onClick={()=>openModal("cliente","edit","Editar Cliente",c)} style={{padding:"3px 6px",fontSize:11}}><i className="ti ti-edit"/></button>}</TD>
              </tr>)}</tbody>
            </table>)}
          </div>
        )}

        {/* ── CONTRAPARTES ── */}
        {!loading&&view==="contrapartes"&&!detail&&(
          <div>
            {pageHead("Contrapartes",btnNew("contraparte","Nueva Contraparte"))}
            {tabBar([["todos","Todas"],["fisica","Personas Fisicas"],["juridica","Personas Juridicas"]],cpFiltro,setCpFiltro)}
            {card(<table style={{width:"100%",borderCollapse:"collapse",fontSize:13,tableLayout:"fixed"}}>
              <thead><tr style={{background:"var(--color-background-secondary)"}}><TH w="22%">Nombre / Razon social</TH><TH w="9%">Tipo</TH><TH w="12%">DNI / CUIT</TH><TH w="10%">Rol</TH><TH w="21%">Abogado contrario</TH><TH w="14%">Area</TH><TH w="6%"></TH></tr></thead>
              <tbody>{filtCp.map((c,i)=><tr key={c.id} style={{borderBottom:i<filtCp.length-1?`0.5px solid ${B}`:"none",opacity:c.activo?1:0.6}}>
                <TD><div style={{fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.nombre}</div>{c.razon_social&&<div style={{fontSize:11,color:"var(--color-text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.razon_social}</div>}</TD>
                <TD><Badge v={c.tipo}/></TD>
                <TD style={{fontSize:12,color:"var(--color-text-secondary)"}}>{c.tipo==="juridica"?c.cuit:c.dni}</TD>
                <TD style={{fontSize:12}}>{c.rol_procesal||"—"}</TD>
                <TD style={{fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.abogado_contraparte||"—"}</TD>
                <TD>{c.area&&<AreaBadge area={c.area} color={areaColor(c.area)}/>}</TD>
                <TD><div style={{display:"flex",gap:3,justifyContent:"center"}}>
                  <button onClick={()=>setDetail(c)} style={{padding:"3px 6px",fontSize:11}} title="Ver"><i className="ti ti-eye"/></button>
                  <button onClick={()=>openModal("contraparte","edit","Editar Contraparte",c)} style={{padding:"3px 6px",fontSize:11}} title="Editar"><i className="ti ti-edit"/></button>
                </div></TD>
              </tr>)}</tbody>
            </table>)}
          </div>
        )}
        {!loading&&view==="contrapartes"&&detail&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1.25rem"}}>
              {btnBack()}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>openModal("contraparte","edit","Editar Contraparte",detail)}><i className="ti ti-edit"/> Editar</button>
                {isAdmin&&<button onClick={()=>doDelete("contrapartes",detail.id)} style={{color:"var(--color-text-danger)",border:"0.5px solid var(--color-border-danger)",background:"var(--color-background-danger)"}}><i className="ti ti-trash"/></button>}
              </div>
            </div>
            <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.5rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:16}}>
                <div><h2 style={{margin:"0 0 4px",fontSize:18,fontWeight:500}}>{detail.nombre}</h2>{detail.razon_social&&<div style={{fontSize:13,color:"var(--color-text-secondary)"}}>{detail.razon_social}</div>}</div>
                <div style={{display:"flex",gap:8}}><Badge v={detail.tipo}/>{detail.rol_procesal&&<Badge v={detail.rol_procesal}/>}{detail.area&&<AreaBadge area={detail.area} color={areaColor(detail.area)}/>}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,borderTop:`0.5px solid ${B}`,paddingTop:16}}>
                <DetailRow label="DNI" value={detail.dni}/>
                <DetailRow label="CUIT" value={detail.cuit}/>
                <DetailRow label="Email" value={detail.email}/>
                <DetailRow label="Telefono / Celular" value={[detail.tel,detail.celular].filter(Boolean).join(" / ")}/>
                <DetailRow label="Domicilio" value={[detail.domicilio,detail.localidad,detail.provincia,detail.cp].filter(Boolean).join(", ")}/>
              </div>
              {(detail.abogado_contraparte||detail.mat_abogado)&&<div style={{marginTop:12,borderTop:`0.5px solid ${B}`,paddingTop:12}}>
                <div style={{fontSize:12,fontWeight:500,marginBottom:8,color:"var(--color-text-secondary)"}}>Letrado de la contraparte</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                  <DetailRow label="Nombre" value={detail.abogado_contraparte}/>
                  <DetailRow label="Matricula / T y F" value={detail.mat_abogado}/>
                </div>
              </div>}
              {detail.observaciones&&<div style={{marginTop:12,borderTop:`0.5px solid ${B}`,paddingTop:12}}><DetailRow label="Observaciones" value={detail.observaciones}/></div>}
              {isAdmin&&detail.notas_internas&&<div style={{marginTop:12,background:"var(--color-background-warning)",borderRadius:6,padding:"10px 12px"}}><div style={{fontSize:11,color:"var(--color-text-warning)",marginBottom:4,fontWeight:500}}>NOTAS INTERNAS</div><div style={{fontSize:13}}>{detail.notas_internas}</div></div>}
            </div>
          </div>
        )}

        {/* ── ABOGADOS ── */}
        {!loading&&view==="abogados"&&(
          <div>
            {pageHead("Abogados",isAdmin&&btnNew("abogado","Nuevo Abogado"))}
            {[{tipo:"interno",label:"Abogados del Estudio",color:"info"},{tipo:"externo",label:"Externos / Contrarios",color:"warning"}].map(({tipo,label,color})=>(
              <Sect key={tipo} title={label} color={color}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {abogados.filter(a=>tipo==="interno"?(a.tipo==="interno"||!a.tipo):a.tipo===tipo).map(a=>(
                    <div key={a.id} style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.25rem",opacity:a.activo?1:0.65}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <Avatar name={a.nombre} size={40} color={a.activo?color:"secondary"}/>
                          <div>
                            <div style={{fontSize:14,fontWeight:500}}>{a.nombre}</div>
                            <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{a.matricula||a.especialidad||"Sin matricula"}</div>
                            {a.dni&&<div style={{fontSize:11,color:"var(--color-text-secondary)"}}>DNI: {a.dni}</div>}
                          </div>
                        </div>
                        {isAdmin&&<button onClick={()=>openModal("abogado","edit","Editar Abogado",a)} style={{padding:"4px 8px",fontSize:12}}><i className="ti ti-edit"/></button>}
                      </div>
                      <div style={{borderTop:`0.5px solid ${B}`,paddingTop:10,display:"flex",flexDirection:"column",gap:5}}>
                        {a.email&&<div style={{display:"flex",gap:8,alignItems:"center"}}><i className="ti ti-mail" style={{fontSize:13,color:"var(--color-text-secondary)",width:16}}/><span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{a.email}</span></div>}
                        {(a.celular||a.tel)&&<div style={{display:"flex",gap:8,alignItems:"center"}}><i className="ti ti-phone" style={{fontSize:13,color:"var(--color-text-secondary)",width:16}}/><span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{a.celular||a.tel}</span></div>}
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                          <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{a.exp_activos||0} exp. activos</span>
                          <Badge v={a.activo?"activo":"cerrado"}/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Sect>
            ))}
          </div>
        )}

        {/* ── JUZGADOS ── */}
        {!loading&&view==="juzgados"&&!detail&&(
          <div>
            {pageHead("Base de Juzgados",isAdmin&&btnNew("juzgado","Nuevo Juzgado"))}
            {filterBar(
              <select value={juzgFuero} onChange={e=>setJuzgFuero(e.target.value)} style={{fontSize:13}}><option value="todos">Todos los fueros</option>{[...new Set(juzgados.map(j=>j.fuero))].sort().map(f=><option key={f}>{f}</option>)}</select>,
              <input value={juzgQ} onChange={e=>setJuzgQ(e.target.value)} placeholder="Buscar por nombre, juez..." style={{fontSize:13,flex:1,minWidth:200}}/>
            )}
            {card(<table style={{width:"100%",borderCollapse:"collapse",fontSize:13,tableLayout:"fixed"}}>
              <thead><tr style={{background:"var(--color-background-secondary)"}}><TH w="33%">Nombre</TH><TH w="12%">Fuero</TH><TH w="19%">Juez/a</TH><TH w="23%">Domicilio</TH><TH w="10%">Tel</TH><TH w="3%"></TH></tr></thead>
              <tbody>{filtJuzg.map((j,i,arr)=><tr key={j.id} style={{borderBottom:i<arr.length-1?`0.5px solid ${B}`:"none"}}>
                <TD style={{fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.nombre}</TD>
                <TD><Badge v={j.fuero}/></TD>
                <TD style={{fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.nombre_juez||"—"}</TD>
                <TD style={{fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{[j.calle,j.numero_calle].filter(Boolean).join(" ")||"—"}</TD>
                <TD style={{fontSize:12,color:"var(--color-text-secondary)"}}>{j.telefono||"—"}</TD>
                <TD><button onClick={()=>setDetail(j)} style={{padding:"3px 6px",fontSize:11}}><i className="ti ti-eye"/></button></TD>
              </tr>)}</tbody>
            </table>)}
          </div>
        )}
        {!loading&&view==="juzgados"&&detail&&(
          <div>
            {btnBack()}
            <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.5rem"}}>
              <h2 style={{margin:"0 0 4px",fontSize:18,fontWeight:500}}>{detail.nombre}</h2>
              <div style={{display:"flex",gap:8,marginBottom:16}}><Badge v={detail.fuero}/><span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{detail.jurisdiccion}</span></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,borderTop:`0.5px solid ${B}`,paddingTop:16}}>
                <DetailRow label="Juez/a titular" value={detail.nombre_juez||"Vacante"}/>
                <DetailRow label="Camara" value={detail.camara}/>
                <DetailRow label="Domicilio" value={[detail.calle,detail.numero_calle,detail.piso&&("Piso "+detail.piso),detail.localidad].filter(Boolean).join(", ")}/>
                <DetailRow label="Telefono / Email" value={[detail.telefono,detail.email].filter(Boolean).join(" · ")}/>
                <DetailRow label="Horario" value={detail.horario}/>
                <DetailRow label="Observaciones" value={detail.observaciones}/>
              </div>
            </div>
          </div>
        )}

        {/* ── DOCTRINA ── */}
        {!loading&&view==="doctrina"&&!detail&&(
          <div>
            {pageHead("Doctrina Juridica",btnNew("doctrina","Nueva Entrada de Doctrina"))}
            {filterBar(
              <select value={docAreaF} onChange={e=>setDocAreaF(e.target.value)} style={{fontSize:13}}><option value="">Todas las areas</option>{areas.map(a=><option key={a.id}>{a.nombre}</option>)}</select>,
              <input value={docQ} onChange={e=>setDocQ(e.target.value)} placeholder="Buscar por titulo, autor..." style={{fontSize:13,flex:1,minWidth:200}}/>,
              <span style={{fontSize:13,color:"var(--color-text-secondary)",alignSelf:"center"}}>{filtDoc.length} entrada(s)</span>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {filtDoc.map(d=>(
                <div key={d.id} onClick={()=>setDetail(d)} style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem",cursor:"pointer",borderLeft:"3px solid var(--color-border-info)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:12,marginBottom:6}}>
                    <div style={{fontWeight:500,fontSize:14}}>{d.titulo}</div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      {d.fuente&&<Badge v={d.fuente}/>}
                      {d.area&&<AreaBadge area={d.area} color={areaColor(d.area)}/>}
                      <button onClick={e=>{e.stopPropagation();openModal("doctrina","edit","Editar Doctrina",d);}} style={{padding:"3px 6px",fontSize:11}}><i className="ti ti-edit"/></button>
                    </div>
                  </div>
                  <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:4}}>{d.autor}{d.publicacion?` — ${d.publicacion}`:""}{d.fecha_publicacion?` (${d.fecha_publicacion?.slice(0,4)})`:""}</div>
                  {d.resumen&&<div style={{fontSize:13,lineHeight:1.5,color:"var(--color-text-secondary)",overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{d.resumen}</div>}
                  {d.voces&&<div style={{marginTop:6}}>{d.voces.split(",").slice(0,5).map((v,i)=><span key={i} style={{background:"var(--color-background-secondary)",padding:"2px 6px",borderRadius:10,marginRight:4,fontSize:11}}>{v.trim()}</span>)}</div>}
                </div>
              ))}
              {filtDoc.length===0&&<div style={{textAlign:"center",padding:"2.5rem",color:"var(--color-text-secondary)"}}><i className="ti ti-notebook" style={{fontSize:36,display:"block",marginBottom:10}}/><p style={{margin:0}}>No hay entradas de doctrina cargadas.</p></div>}
            </div>
          </div>
        )}
        {!loading&&view==="doctrina"&&detail&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1.25rem"}}>
              {btnBack()}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>openModal("doctrina","edit","Editar Doctrina",detail)}><i className="ti ti-edit"/> Editar</button>
                {isAdmin&&<button onClick={()=>doDelete("doctrina",detail.id)} style={{color:"var(--color-text-danger)",border:"0.5px solid var(--color-border-danger)",background:"var(--color-background-danger)"}}><i className="ti ti-trash"/></button>}
              </div>
            </div>
            <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.5rem",borderLeft:"3px solid var(--color-border-info)"}}>
              <h2 style={{margin:"0 0 8px",fontSize:18,fontWeight:500}}>{detail.titulo}</h2>
              <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>{detail.fuente&&<Badge v={detail.fuente}/>}{detail.area&&<AreaBadge area={detail.area} color={areaColor(detail.area)}/>}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,borderTop:`0.5px solid ${B}`,paddingTop:16}}>
                <DetailRow label="Autor" value={detail.autor}/>
                <DetailRow label="Coautores" value={detail.coautores}/>
                <DetailRow label="Publicacion" value={detail.publicacion}/>
                <DetailRow label="Fecha" value={detail.fecha_publicacion?.slice(0,10)}/>
              </div>
              {detail.voces&&<div style={{margin:"12px 0"}}><div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:6}}>Voces</div><div>{detail.voces.split(",").map((v,i)=><span key={i} style={{background:"var(--color-background-secondary)",padding:"3px 8px",borderRadius:12,marginRight:4,fontSize:12}}>{v.trim()}</span>)}</div></div>}
              {detail.resumen&&<div style={{margin:"12px 0",borderTop:`0.5px solid ${B}`,paddingTop:12}}><DetailRow label="Resumen" value={detail.resumen}/></div>}
              {detail.contenido&&<div style={{margin:"12px 0",borderTop:`0.5px solid ${B}`,paddingTop:12}}><div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:6}}>Contenido</div><div style={{fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{detail.contenido}</div></div>}
              {detail.url&&<a href={detail.url} target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:"var(--color-text-info)",display:"flex",alignItems:"center",gap:5,marginTop:12}}><i className="ti ti-external-link"/> Ver fuente original</a>}
            </div>
          </div>
        )}

        {/* ── JURISPRUDENCIA ── */}
        {!loading&&view==="jurisprudencia"&&!detail&&(
          <div>
            {pageHead("Jurisprudencia",btnNew("jurisprudencia","Nuevo Fallo"))}
            {filterBar(
              <select value={jurisAreaF} onChange={e=>setJurisAreaF(e.target.value)} style={{fontSize:13}}><option value="">Todas las areas</option>{areas.map(a=><option key={a.id}>{a.nombre}</option>)}</select>,
              <input value={jurisQ} onChange={e=>setJurisQ(e.target.value)} placeholder="Buscar por caratula, tema..." style={{fontSize:13,flex:1,minWidth:200}}/>,
              <span style={{fontSize:13,color:"var(--color-text-secondary)",alignSelf:"center"}}>{filtJuris.length} fallo(s)</span>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {filtJuris.map(j=>(
                <div key={j.id} onClick={()=>setDetail(j)} style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem",cursor:"pointer",borderLeft:"3px solid var(--color-border-secondary)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:12,marginBottom:6}}>
                    <div style={{fontWeight:500,fontSize:14,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.caratula}</div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      {j.area&&<AreaBadge area={j.area} color={areaColor(j.area)}/>}
                      <button onClick={e=>{e.stopPropagation();openModal("jurisprudencia","edit","Editar Jurisprudencia",j);}} style={{padding:"3px 6px",fontSize:11}}><i className="ti ti-edit"/></button>
                    </div>
                  </div>
                  <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:4}}><strong>{j.tribunal}</strong>{j.sala?` — Sala ${j.sala}`:""}{j.fecha_fallo?` · ${j.fecha_fallo?.slice(0,10)}`:""}{j.cita?` · ${j.cita}`:""}</div>
                  {j.tema&&<div style={{fontSize:13,color:"var(--color-text-primary)",marginBottom:4}}>{j.tema}</div>}
                  {j.resumen&&<div style={{fontSize:13,lineHeight:1.5,color:"var(--color-text-secondary)",overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{j.resumen}</div>}
                </div>
              ))}
              {filtJuris.length===0&&<div style={{textAlign:"center",padding:"2.5rem",color:"var(--color-text-secondary)"}}><i className="ti ti-gavel" style={{fontSize:36,display:"block",marginBottom:10}}/><p style={{margin:0}}>No hay fallos cargados.</p></div>}
            </div>
          </div>
        )}
        {!loading&&view==="jurisprudencia"&&detail&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1.25rem"}}>
              {btnBack()}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>openModal("jurisprudencia","edit","Editar",detail)}><i className="ti ti-edit"/> Editar</button>
                {isAdmin&&<button onClick={()=>doDelete("jurisprudencia",detail.id)} style={{color:"var(--color-text-danger)",border:"0.5px solid var(--color-border-danger)",background:"var(--color-background-danger)"}}><i className="ti ti-trash"/></button>}
              </div>
            </div>
            <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.5rem"}}>
              <h2 style={{margin:"0 0 8px",fontSize:16,fontWeight:500,lineHeight:1.4}}>{detail.caratula}</h2>
              <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
                {detail.area&&<AreaBadge area={detail.area} color={areaColor(detail.area)}/>}
                {detail.cita&&<span style={{fontSize:12,fontFamily:"var(--font-mono)",color:"var(--color-text-secondary)"}}>{detail.cita}</span>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,borderTop:`0.5px solid ${B}`,paddingTop:16}}>
                <DetailRow label="Tribunal" value={detail.tribunal}/>
                <DetailRow label="Sala" value={detail.sala}/>
                <DetailRow label="Fecha del fallo" value={detail.fecha_fallo?.slice(0,10)}/>
                <DetailRow label="Publicado en" value={detail.publicado_en}/>
                <DetailRow label="Tema" value={detail.tema}/>
              </div>
              {detail.voces&&<div style={{margin:"12px 0",borderTop:`0.5px solid ${B}`,paddingTop:12}}><div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:6}}>Voces</div><div>{detail.voces.split(",").map((v,i)=><span key={i} style={{background:"var(--color-background-secondary)",padding:"3px 8px",borderRadius:12,marginRight:4,fontSize:12}}>{v.trim()}</span>)}</div></div>}
              {detail.resumen&&<div style={{margin:"12px 0",borderTop:`0.5px solid ${B}`,paddingTop:12}}><DetailRow label="Resumen" value={detail.resumen}/></div>}
              {detail.texto&&<div style={{margin:"12px 0",borderTop:`0.5px solid ${B}`,paddingTop:12}}><div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:6}}>Extracto del fallo</div><div style={{fontSize:13,lineHeight:1.9,whiteSpace:"pre-wrap",fontFamily:"Georgia,serif"}}>{detail.texto}</div></div>}
              {detail.url&&<a href={detail.url} target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:"var(--color-text-info)",display:"flex",alignItems:"center",gap:5,marginTop:12}}><i className="ti ti-external-link"/> Ver fallo completo</a>}
            </div>
          </div>
        )}

        {/* ── LEYES ── */}
        {!loading&&view==="leyes"&&!detail&&(
          <div>
            {pageHead("Legislacion",btnNew("ley","Nueva Ley / Decreto"))}
            {filterBar(
              <select value={leyAreaF} onChange={e=>setLeyAreaF(e.target.value)} style={{fontSize:13}}><option value="">Todas las areas</option>{areas.map(a=><option key={a.id}>{a.nombre}</option>)}</select>,
              <select value={leyTipoF} onChange={e=>setLeyTipoF(e.target.value)} style={{fontSize:13}}><option value="">Todos los tipos</option>{TIPOS_LEY.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}</select>,
              <input value={leyQ} onChange={e=>setLeyQ(e.target.value)} placeholder="Buscar por numero o nombre..." style={{fontSize:13,flex:1,minWidth:180}}/>,
              <span style={{fontSize:13,color:"var(--color-text-secondary)",alignSelf:"center"}}>{filtLeyes.length} norma(s)</span>
            )}
            {card(<table style={{width:"100%",borderCollapse:"collapse",fontSize:13,tableLayout:"fixed"}}>
              <thead><tr style={{background:"var(--color-background-secondary)"}}><TH w="9%">Numero</TH><TH w="34%">Nombre</TH><TH w="10%">Tipo</TH><TH w="13%">Area</TH><TH w="10%">Sancion</TH><TH w="10%">Vigencia</TH><TH w="4%"></TH></tr></thead>
              <tbody>{filtLeyes.map((l,i,arr)=><tr key={l.id} style={{borderBottom:i<arr.length-1?`0.5px solid ${B}`:"none",cursor:"pointer"}} onClick={()=>setDetail(l)}>
                <TD style={{fontFamily:"var(--font-mono)",fontSize:12,fontWeight:500}}>{l.numero}</TD>
                <TD><div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500}}>{l.nombre}</div>{l.organismo&&<div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{l.organismo}</div>}</TD>
                <TD><Badge v={l.tipo}/></TD>
                <TD>{l.area&&<AreaBadge area={l.area} color={areaColor(l.area)}/>}</TD>
                <TD style={{fontSize:12,color:"var(--color-text-secondary)"}}>{l.fecha_sancion?.slice(0,10)||"—"}</TD>
                <TD style={{fontSize:12,color:"var(--color-text-secondary)"}}>{l.fecha_vigencia?.slice(0,10)||"—"}</TD>
                <TD><button onClick={e=>{e.stopPropagation();openModal("ley","edit","Editar Ley",l);}} style={{padding:"3px 6px",fontSize:11}}><i className="ti ti-edit"/></button></TD>
              </tr>)}</tbody>
            </table>)}
          </div>
        )}
        {!loading&&view==="leyes"&&detail&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1.25rem"}}>
              {btnBack()}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>openModal("ley","edit","Editar Ley",detail)}><i className="ti ti-edit"/> Editar</button>
                {isAdmin&&<button onClick={()=>doDelete("leyes",detail.id)} style={{color:"var(--color-text-danger)",border:"0.5px solid var(--color-border-danger)",background:"var(--color-background-danger)"}}><i className="ti ti-trash"/></button>}
              </div>
            </div>
            <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.5rem"}}>
              <div style={{display:"flex",gap:8,marginBottom:8}}><Badge v={detail.tipo}/>{detail.area&&<AreaBadge area={detail.area} color={areaColor(detail.area)}/>}</div>
              <h2 style={{margin:"0 0 4px",fontSize:18,fontWeight:500}}>Ley N {detail.numero}</h2>
              <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:400,color:"var(--color-text-secondary)"}}>{detail.nombre}</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,borderTop:`0.5px solid ${B}`,paddingTop:16}}>
                <DetailRow label="Organismo" value={detail.organismo}/>
                <DetailRow label="Fecha de sancion" value={detail.fecha_sancion?.slice(0,10)}/>
                <DetailRow label="Fecha de promulgacion" value={detail.fecha_promulgacion?.slice(0,10)}/>
                <DetailRow label="Fecha de vigencia" value={detail.fecha_vigencia?.slice(0,10)}/>
                <DetailRow label="Boletin Oficial N" value={detail.boletin_numero}/>
              </div>
              {detail.resumen&&<div style={{margin:"12px 0",borderTop:`0.5px solid ${B}`,paddingTop:12}}><DetailRow label="Resumen" value={detail.resumen}/></div>}
              {detail.texto&&<div style={{margin:"12px 0",borderTop:`0.5px solid ${B}`,paddingTop:12}}><div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:6}}>Articulos clave</div><div style={{fontSize:13,lineHeight:1.9,whiteSpace:"pre-wrap",fontFamily:"Georgia,serif"}}>{detail.texto}</div></div>}
              {detail.url_infoleg&&<a href={detail.url_infoleg} target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:"var(--color-text-info)",display:"flex",alignItems:"center",gap:5,marginTop:12}}><i className="ti ti-external-link"/> Ver en InfoLEG</a>}
            </div>
          </div>
        )}

        {/* ── MODELOS ── */}
        {!loading&&view==="modelos"&&!modeloSelec&&(
          <div>
            {pageHead("Modelos de Escritos y Contratos")}
            {tabBar([["todos","Todos"],["escrito","Escritos"],["contrato","Contratos"]],modeloTipo,v=>{setModeloTipo(v);setModeloCat("todas");})}
            {filterBar(<select value={modeloCat} onChange={e=>setModeloCat(e.target.value)} style={{fontSize:13}}><option value="todas">Todas las categorias</option>{categorias.filter(c=>modeloTipo==="todos"||c.tipo===modeloTipo).map(c=><option key={c.id} value={String(c.id)}>{c.nombre}</option>)}</select>,<span style={{fontSize:13,color:"var(--color-text-secondary)",alignSelf:"center"}}>{filtModelos.length} modelo(s)</span>)}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {filtModelos.map(m=>{const c=m.categoria_tipo==="escrito"?"info":"success";return(
                <div key={m.id} onClick={async()=>{try{const f=await api.get(`/api/modelos/${m.id}`);setModeloSelec(f);setModeloVars({});}catch{alert("Error al cargar modelo");}}} style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.25rem",cursor:"pointer",transition:"border-color .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=`var(--color-border-${c})`}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=B}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <div style={{width:36,height:36,borderRadius:"var(--border-radius-md)",background:`var(--color-background-${c})`,display:"flex",alignItems:"center",justifyContent:"center"}}><i className={`ti ${m.categoria_tipo==="escrito"?"ti-file-description":"ti-contract"}`} style={{fontSize:18,color:`var(--color-text-${c})`}}/></div>
                    <div style={{display:"flex",gap:6,alignItems:"flex-start"}}><Badge v={m.categoria_tipo}/>{m.area&&<AreaBadge area={m.area} color={areaColor(m.area)}/>}</div>
                  </div>
                  <div style={{fontSize:14,fontWeight:500,marginBottom:4}}>{m.nombre}</div>
                  <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.4}}>{m.descripcion}</div>
                  <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:8}}>{m.categoria_nombre} · v{m.version}</div>
                </div>
              );})}
            </div>
          </div>
        )}
        {!loading&&view==="modelos"&&modeloSelec&&<ModeloViewer modelo={modeloSelec} vars={modeloVars} setVars={setModeloVars} onBack={()=>setModeloSelec(null)}/>}


        {/* ── ESCRITOS PROPIOS ── */}
        {!loading&&view==="escritos"&&<EscriitosPropios
          escritos={escritos} cats={escritosCats} areas={areas} exps={exps}
          areaColor={areaColor} isAdmin={isAdmin} onRefresh={loadData} B={B}
        />}
        {/* ── INVESTIGACION IA ── */}
        {view==="investigacion"&&(
          <div>
            {pageHead("Investigacion Legal con IA")}
            <p style={{margin:"-0.5rem 0 1.25rem",fontSize:13,color:"var(--color-text-secondary)"}}>Busqueda asistida en jurisprudencia, doctrina y legislacion argentina.</p>
            <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.25rem",marginBottom:"1.5rem"}}>
              {tabBar([["jurisprudencia","Jurisprudencia"],["doctrina","Doctrina"],["legislacion","Legislacion"]],searchType,setSearchType)}
              <div style={{display:"flex",gap:8}}>
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} placeholder={`Buscar en ${searchType}...`} style={{flex:1}}/>
                <button onClick={doSearch} disabled={searching} style={{background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)",display:"flex",alignItems:"center",gap:6,padding:"0 16px"}}>
                  {searching?<Spinner/>:<i className="ti ti-search"/>}{searching?"Buscando...":"Buscar con IA"}
                </button>
              </div>
            </div>
            {searchRes?.error&&<Err msg={searchRes.error}/>}
            {searchRes&&!searchRes.error&&(
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <h3 style={{margin:0,fontSize:15,fontWeight:500}}>{searchRes.titulo}</h3>
                  <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{searchRes.resultados?.length||0} resultado(s)</span>
                </div>
                {searchRes.nota&&<div style={{background:"var(--color-background-warning)",border:"0.5px solid var(--color-border-warning)",borderRadius:"var(--border-radius-md)",padding:"10px 14px",fontSize:12,marginBottom:14}}>{searchRes.nota}</div>}
                {searchRes.raw&&<div style={{fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{searchRes.nota}</div>}
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {(searchRes.resultados||[]).map((r,i)=>(
                    <div key={i} style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem",borderLeft:`3px solid var(--color-border-${r.relevancia==="alta"?"info":"secondary"})`}}>
                      <div style={{display:"flex",justifyContent:"space-between",gap:10,marginBottom:6}}>
                        <div style={{fontSize:14,fontWeight:500}}>{r.titulo}</div>
                        <div style={{flexShrink:0,display:"flex",gap:6,alignItems:"center"}}>{r.relevancia==="alta"&&<Badge v="activo"/>}<span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{r.fecha}</span></div>
                      </div>
                      <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:6}}>{r.referencia}</div>
                      <div style={{fontSize:13,lineHeight:1.5}}>{r.resumen}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!searchRes&&!searching&&<div style={{textAlign:"center",padding:"2.5rem",color:"var(--color-text-secondary)"}}>
              <i className="ti ti-books" style={{fontSize:40,display:"block",marginBottom:12}}/>
              <p style={{margin:0,fontSize:14,fontWeight:500}}>Busca jurisprudencia, doctrina o legislacion</p>
              <p style={{margin:"8px 0 0",fontSize:13}}>La IA busca en la web y devuelve resultados relevantes para el derecho argentino.</p>
            </div>}
          </div>
        )}

      </main>
    </div>
  );
}
