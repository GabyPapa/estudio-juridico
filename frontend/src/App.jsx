import { useState, useEffect, useCallback, useRef } from "react";
import { api, descargar } from "./api";

// ── Constantes ──────────────────────────────────────────────
const AREAS_DEF = {
  Corporativo: { icon:"ti-building-skyscraper", color:"info",     desc:"M&A, contratos corporativos, gobierno corporativo, financiamiento estructurado y compliance." },
  Societario:  { icon:"ti-users",               color:"success",  desc:"Constitución y reorganización de sociedades, estatutos, asambleas, directorio y registros ante IGJ." },
  Comercial:   { icon:"ti-briefcase",            color:"warning",  desc:"Contratos comerciales, distribución, franquicias, concursos, quiebras y cobro ejecutivo." },
  Civil:       { icon:"ti-scale",                color:"secondary",desc:"Contratos civiles, responsabilidad civil, sucesiones, inmobiliario y daños y perjuicios." },
  Laboral:     { icon:"ti-id-badge-2",           color:"danger",   desc:"Relaciones laborales, despidos, convenios colectivos, seguridad social y litigios ante el CNAT." },
};
const NAV = [
  { id:"dashboard",     label:"Panel General",       icon:"ti-layout-dashboard" },
  { id:"areas",         label:"Áreas del Estudio",   icon:"ti-books" },
  { id:"investigacion", label:"Investigación Legal",  icon:"ti-search" },
  { id:"expedientes",   label:"Expedientes",          icon:"ti-folder-open" },
  { id:"clientes",      label:"Clientes",             icon:"ti-users" },
  { id:"abogados",      label:"Abogados",             icon:"ti-user-circle" },
  { id:"juzgados",      label:"Juzgados",             icon:"ti-building-courthouse" },
  { id:"modelos",       label:"Modelos",              icon:"ti-file-text" },
];
const ROL_LABEL = { socio:"Socio", abogado:"Abogado", administrador:"Administrador" };
const inits = n => n.replace(/^Dr[a]?\.?\s+/i,"").split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
const colorArea = a => ({Corporativo:"info",Societario:"success",Comercial:"warning",Civil:"secondary",Laboral:"danger"}[a]||"secondary");
const B = "var(--color-border-tertiary)";

// ── Componentes base ────────────────────────────────────────
const Badge = ({v}) => {
  const m = {activo:["success","Activo"],cerrado:["secondary","Cerrado"],suspendido:["warning","Suspendido"],actual:["info","Actual"],potencial:["warning","Potencial"]};
  const [c,l] = m[v]||m.activo;
  return <span style={{background:`var(--color-background-${c})`,color:`var(--color-text-${c})`,fontSize:11,padding:"2px 9px",borderRadius:20,fontWeight:500}}>{l}</span>;
};
const AreaBadge = ({area}) => {
  const c = colorArea(area);
  return <span style={{background:`var(--color-background-${c})`,color:`var(--color-text-${c})`,fontSize:11,padding:"2px 9px",borderRadius:20}}>{area}</span>;
};
const Avatar = ({name,size=36,color="info"}) => (
  <div style={{width:size,height:size,borderRadius:"50%",background:`var(--color-background-${color})`,color:`var(--color-text-${color})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:500,fontSize:size<32?11:13,flexShrink:0}}>
    {inits(name)}
  </div>
);
const Spinner = () => <i className="ti ti-loader-2 ti-spin" aria-hidden="true"/>;
const Err = ({msg}) => msg ? <div style={{color:"var(--color-text-danger)",fontSize:13,marginTop:8}}>{msg}</div> : null;

// ── Modal ───────────────────────────────────────────────────
function Modal({title, onClose, children}) {
  return (
    <div style={{position:"absolute",inset:0,zIndex:50,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:40}}>
      <div style={{background:"var(--color-background-primary)",borderRadius:"var(--border-radius-lg)",border:`0.5px solid ${B}`,padding:"1.5rem",width:560,maxWidth:"95%",maxHeight:"82vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
          <h2 style={{margin:0,fontSize:16,fontWeight:500}}>{title}</h2>
          <button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",padding:4,color:"var(--color-text-secondary)",fontSize:18}}><i className="ti ti-x"/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Formularios ─────────────────────────────────────────────
function ExpForm({initial,abogados,clientes,onSave,onCancel,loading}) {
  const [d,setD] = useState(initial || {caratula:"",area:"Comercial",estado:"activo",id_cliente:"",id_abogado:"",juzgado:"",apertura:"",prox_fecha:"",notas:""});
  const set = (k,v) => setD(p=>({...p,[k]:v}));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Carátula *</label><input value={d.caratula} onChange={e=>set("caratula",e.target.value)} style={{width:"100%",marginTop:4}}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Área</label>
          <select value={d.area} onChange={e=>set("area",e.target.value)} style={{width:"100%",marginTop:4}}>
            {Object.keys(AREAS_DEF).map(a=><option key={a}>{a}</option>)}
          </select>
        </div>
        <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Estado</label>
          <select value={d.estado} onChange={e=>set("estado",e.target.value)} style={{width:"100%",marginTop:4}}>
            <option value="activo">Activo</option><option value="cerrado">Cerrado</option><option value="suspendido">Suspendido</option>
          </select>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Cliente</label>
          <select value={d.id_cliente||""} onChange={e=>set("id_cliente",e.target.value)} style={{width:"100%",marginTop:4}}>
            <option value="">— Seleccionar —</option>
            {clientes.map(c=><option key={c.id} value={c.id}>{c.razon}</option>)}
          </select>
        </div>
        <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Abogado asignado</label>
          <select value={d.id_abogado||""} onChange={e=>set("id_abogado",e.target.value)} style={{width:"100%",marginTop:4}}>
            <option value="">— Seleccionar —</option>
            {abogados.filter(a=>a.activo).map(a=><option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>
        </div>
      </div>
      <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Juzgado / Organismo</label><input value={d.juzgado||""} onChange={e=>set("juzgado",e.target.value)} style={{width:"100%",marginTop:4}}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Fecha apertura</label><input type="date" value={d.apertura||""} onChange={e=>set("apertura",e.target.value)} style={{width:"100%",marginTop:4}}/></div>
        <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Próxima fecha</label><input type="date" value={d.prox_fecha||""} onChange={e=>set("prox_fecha",e.target.value)} style={{width:"100%",marginTop:4}}/></div>
      </div>
      <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Notas</label><textarea value={d.notas||""} onChange={e=>set("notas",e.target.value)} rows={2} style={{width:"100%",marginTop:4}}/></div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:8}}>
        <button onClick={onCancel} disabled={loading}>Cancelar</button>
        <button onClick={()=>onSave(d)} disabled={loading} style={{background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)"}}>
          {loading?<Spinner/>:"Guardar"}
        </button>
      </div>
    </div>
  );
}

function ClienteForm({initial,onSave,onCancel,loading}) {
  const [d,setD] = useState(initial||{razon:"",tipo:"actual",area:"Corporativo",cuit:"",contacto:"",email:"",tel:"",notas:""});
  const set = (k,v) => setD(p=>({...p,[k]:v}));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Razón social / Nombre *</label><input value={d.razon} onChange={e=>set("razon",e.target.value)} style={{width:"100%",marginTop:4}}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Tipo</label>
          <select value={d.tipo} onChange={e=>set("tipo",e.target.value)} style={{width:"100%",marginTop:4}}><option value="actual">Actual</option><option value="potencial">Potencial</option></select>
        </div>
        <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Área principal</label>
          <select value={d.area||"Corporativo"} onChange={e=>set("area",e.target.value)} style={{width:"100%",marginTop:4}}>
            {Object.keys(AREAS_DEF).map(a=><option key={a}>{a}</option>)}
          </select>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>CUIT</label><input value={d.cuit||""} onChange={e=>set("cuit",e.target.value)} style={{width:"100%",marginTop:4}}/></div>
        <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Contacto</label><input value={d.contacto||""} onChange={e=>set("contacto",e.target.value)} style={{width:"100%",marginTop:4}}/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Email</label><input type="email" value={d.email||""} onChange={e=>set("email",e.target.value)} style={{width:"100%",marginTop:4}}/></div>
        <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Teléfono</label><input value={d.tel||""} onChange={e=>set("tel",e.target.value)} style={{width:"100%",marginTop:4}}/></div>
      </div>
      <div><label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Notas</label><textarea value={d.notas||""} onChange={e=>set("notas",e.target.value)} rows={2} style={{width:"100%",marginTop:4}}/></div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:8}}>
        <button onClick={onCancel} disabled={loading}>Cancelar</button>
        <button onClick={()=>onSave(d)} disabled={loading} style={{background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)"}}>
          {loading?<Spinner/>:"Guardar"}
        </button>
      </div>
    </div>
  );
}

function AbogadoForm({initial,onSave,onCancel,loading}) {
  const [d,setD] = useState(initial||{
    nombre:"",tipo:"interno",matricula:"",especialidad:"",email:"",tel:"",
    dni:"",celular:"",domicilio:"",localidad:"",provincia:"Buenos Aires",cp:"",
    fecha_nac:"",notas_internas:"",activo:true
  });
  const set = (k,v) => setD(p=>({...p,[k]:v}));
  const L = ({label}) => <label style={{fontSize:11,color:"var(--color-text-secondary)",display:"block",marginBottom:3}}>{label}</label>;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:"70vh",overflowY:"auto",paddingRight:4}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={{gridColumn:"1/-1"}}><L label="Nombre y apellido *"/><input value={d.nombre} onChange={e=>set("nombre",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Tipo"/>
          <select value={d.tipo} onChange={e=>set("tipo",e.target.value)} style={{width:"100%"}}>
            <option value="interno">Abogado del estudio</option>
            <option value="externo">Abogado externo/contrario</option>
          </select>
        </div>
        <div><L label="Estado"/>
          <select value={d.activo?"activo":"inactivo"} onChange={e=>set("activo",e.target.value==="activo")} style={{width:"100%"}}>
            <option value="activo">Activo</option><option value="inactivo">Inactivo</option>
          </select>
        </div>
        <div><L label="DNI"/><input value={d.dni||""} onChange={e=>set("dni",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Fecha de nacimiento"/><input type="date" value={d.fecha_nac||""} onChange={e=>set("fecha_nac",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Matrícula principal"/><input value={d.matricula||""} onChange={e=>set("matricula",e.target.value)} style={{width:"100%"}} placeholder="Ej: CPACF T.85 F.372"/></div>
        <div><L label="Especialidad"/><input value={d.especialidad||""} onChange={e=>set("especialidad",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Email"/><input type="email" value={d.email||""} onChange={e=>set("email",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Teléfono fijo"/><input value={d.tel||""} onChange={e=>set("tel",e.target.value)} style={{width:"100%"}}/></div>
        <div style={{gridColumn:"1/-1"}}><L label="Domicilio real"/><input value={d.domicilio||""} onChange={e=>set("domicilio",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Localidad"/><input value={d.localidad||""} onChange={e=>set("localidad",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Provincia"/><input value={d.provincia||""} onChange={e=>set("provincia",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Celular"/><input value={d.celular||""} onChange={e=>set("celular",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Código postal"/><input value={d.cp||""} onChange={e=>set("cp",e.target.value)} style={{width:"100%"}}/></div>
        <div style={{gridColumn:"1/-1"}}><L label="Notas internas"/><textarea rows={2} value={d.notas_internas||""} onChange={e=>set("notas_internas",e.target.value)} style={{width:"100%",fontSize:12}}/></div>
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:4}}>
        <button onClick={onCancel} disabled={loading}>Cancelar</button>
        <button onClick={()=>onSave(d)} disabled={loading||!d.nombre} style={{background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)"}}>
          {loading?<Spinner/>:"Guardar"}
        </button>
      </div>
    </div>
  );
}

function JuzgadoForm({initial,onSave,onCancel,loading}) {
  const [d,setD] = useState(initial||{
    numero:"",nombre:"",fuero:"Comercial",jurisdiccion:"Nacional",camara:"",
    nombre_juez:"",calle:"",numero_calle:"",piso:"",oficina:"",cp:"",
    localidad:"CABA",provincia:"Buenos Aires",telefono:"",fax:"",email:"",
    horario:"09:00–13:30",observaciones:""
  });
  const set = (k,v) => setD(p=>({...p,[k]:v}));
  const L = ({label}) => <label style={{fontSize:11,color:"var(--color-text-secondary)",display:"block",marginBottom:3}}>{label}</label>;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:"70vh",overflowY:"auto",paddingRight:4}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><L label="Nº Juzgado"/><input type="number" value={d.numero||""} onChange={e=>set("numero",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Fuero"/>
          <select value={d.fuero} onChange={e=>set("fuero",e.target.value)} style={{width:"100%"}}>
            {["Comercial","Civil","Laboral","Penal","Federal","Civil y Comercial Federal","Contencioso Administrativo","Familia","Registral","Administrativo Laboral"].map(f=><option key={f}>{f}</option>)}
          </select>
        </div>
        <div style={{gridColumn:"1/-1"}}><L label="Nombre completo *"/><input value={d.nombre} onChange={e=>set("nombre",e.target.value)} style={{width:"100%"}} placeholder="Juzgado Nacional de 1ª Instancia en lo Comercial Nº 1"/></div>
        <div><L label="Jurisdicción"/>
          <select value={d.jurisdiccion} onChange={e=>set("jurisdiccion",e.target.value)} style={{width:"100%"}}>
            <option value="Nacional">Nacional</option>
            <option value="Ciudad">Ciudad (CABA)</option>
            <option value="Provincial">Provincial</option>
            <option value="Federal">Federal</option>
          </select>
        </div>
        <div><L label="Cámara de apelaciones"/><input value={d.camara||""} onChange={e=>set("camara",e.target.value)} style={{width:"100%"}}/></div>
        <div style={{gridColumn:"1/-1"}}><L label="Nombre del Juez/a"/><input value={d.nombre_juez||""} onChange={e=>set("nombre_juez",e.target.value)} style={{width:"100%"}} placeholder="Dr./Dra. Apellido Nombre"/></div>
        <div><L label="Calle"/><input value={d.calle||""} onChange={e=>set("calle",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Número"/><input value={d.numero_calle||""} onChange={e=>set("numero_calle",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Piso"/><input value={d.piso||""} onChange={e=>set("piso",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Oficina/Departamento"/><input value={d.oficina||""} onChange={e=>set("oficina",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Localidad"/><input value={d.localidad||""} onChange={e=>set("localidad",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Código Postal"/><input value={d.cp||""} onChange={e=>set("cp",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Teléfono"/><input value={d.telefono||""} onChange={e=>set("telefono",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Email"/><input type="email" value={d.email||""} onChange={e=>set("email",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Fax"/><input value={d.fax||""} onChange={e=>set("fax",e.target.value)} style={{width:"100%"}}/></div>
        <div><L label="Horario"/><input value={d.horario||""} onChange={e=>set("horario",e.target.value)} style={{width:"100%"}}/></div>
        <div style={{gridColumn:"1/-1"}}><L label="Observaciones"/><textarea rows={2} value={d.observaciones||""} onChange={e=>set("observaciones",e.target.value)} style={{width:"100%",fontSize:12}}/></div>
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:4}}>
        <button onClick={onCancel} disabled={loading}>Cancelar</button>
        <button onClick={()=>onSave(d)} disabled={loading||!d.nombre} style={{background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)"}}>
          {loading?<Spinner/>:"Guardar"}
        </button>
      </div>
    </div>
  );
}

// ── Login Screen ────────────────────────────────────────────
function LoginScreen({onLogin}) {
  const [email,setEmail] = useState("");
  const [pass,setPass]   = useState("");
  const [loading,setLoading] = useState(false);
  const [err,setErr]     = useState("");

  const doLogin = async () => {
    if (!email||!pass) return setErr("Completá todos los campos");
    setLoading(true); setErr("");
    try {
      const data = await api.post("/api/auth/login", {email,password:pass});
      localStorage.setItem("token", data.token);
      onLogin(data.user);
    } catch(e) {
      setErr(e.message||"Error al iniciar sesión");
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--color-background-tertiary)"}}>
      <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"2rem 2.5rem",width:380}}>
        <div style={{textAlign:"center",marginBottom:"1.75rem"}}>
          <div style={{width:52,height:52,borderRadius:14,background:"var(--color-background-info)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
            <i className="ti ti-gavel" style={{fontSize:26,color:"var(--color-text-info)"}} aria-hidden="true"/>
          </div>
          <h1 style={{margin:"0 0 4px",fontSize:20,fontWeight:500}}>Estudio Jurídico</h1>
          <p style={{margin:0,fontSize:13,color:"var(--color-text-secondary)"}}>Sistema de Gestión</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="usuario@estudio.com" style={{width:"100%",marginTop:4}}/>
          </div>
          <div>
            <label style={{fontSize:12,color:"var(--color-text-secondary)"}}>Contraseña</label>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} style={{width:"100%",marginTop:4}}/>
          </div>
          <Err msg={err}/>
          <button onClick={doLogin} disabled={loading} style={{width:"100%",background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)",padding:"9px",fontWeight:500,marginTop:4,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {loading?<><Spinner/> Ingresando...</>:"Ingresar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tabla de expedientes ────────────────────────────────────
function ExpTable({exps,onEdit,onDetail,canEdit}) {
  if (!exps.length) return <div style={{textAlign:"center",padding:"2rem",color:"var(--color-text-secondary)",fontSize:13}}>No hay expedientes para mostrar</div>;
  return (
    <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",overflow:"hidden"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,tableLayout:"fixed"}}>
        <thead>
          <tr style={{background:"var(--color-background-secondary)"}}>
            {["Número","Carátula","Área","Estado","Abogado","Prox. fecha",""].map((h,i)=>(
              <th key={i} style={{padding:"10px 12px",textAlign:"left",fontWeight:500,borderBottom:`0.5px solid ${B}`,width:[13,32,11,10,18,12,8][i]+"%"}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {exps.map((e,i)=>(
            <tr key={e.id} style={{borderBottom:i<exps.length-1?`0.5px solid ${B}`:"none"}}>
              <td style={{padding:"10px 12px",fontSize:12,color:"var(--color-text-secondary)",fontFamily:"var(--font-mono)"}}>{e.numero}</td>
              <td style={{padding:"10px 12px",overflow:"hidden"}}>
                <div style={{fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.caratula}</div>
                <div style={{fontSize:11,color:"var(--color-text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.juzgado}</div>
              </td>
              <td style={{padding:"10px 12px"}}><AreaBadge area={e.area}/></td>
              <td style={{padding:"10px 12px"}}><Badge v={e.estado}/></td>
              <td style={{padding:"10px 12px"}}>
                {e.abogado_nombre && <div style={{display:"flex",alignItems:"center",gap:6,overflow:"hidden"}}>
                  <Avatar name={e.abogado_nombre} size={24} color="info"/>
                  <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:12}}>{e.abogado_nombre.replace(/^Dr[a]?\.?\s+/i,"")}</span>
                </div>}
              </td>
              <td style={{padding:"10px 12px",fontSize:12,color:e.prox_fecha?"var(--color-text-warning)":"var(--color-text-secondary)"}}>{e.prox_fecha?e.prox_fecha.slice(0,10):"—"}</td>
              <td style={{padding:"10px 6px",textAlign:"center"}}>
                <div style={{display:"flex",gap:4,justifyContent:"center"}}>
                  <button onClick={()=>onDetail(e)} style={{padding:"4px 6px",fontSize:12}} title="Ver"><i className="ti ti-eye" aria-hidden="true"/></button>
                  {canEdit && <button onClick={()=>onEdit(e)} style={{padding:"4px 6px",fontSize:12}} title="Editar"><i className="ti ti-edit" aria-hidden="true"/></button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── App principal ───────────────────────────────────────────
export default function App() {
  // BUG FIX: verificar expiración del token al cargar la página.
  // El approach anterior decodificaba el JWT sin revisar 'exp', dejando al usuario
  // "logueado" en la UI hasta que la primera llamada a la API fallaba con 401.
  const [user,setUser] = useState(() => {
    const t = localStorage.getItem('token');
    if (!t) return null;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return null;
      }
      return payload;
    } catch {
      localStorage.removeItem('token');
      return null;
    }
  });
  const [view,setView]       = useState("dashboard");
  const [abogados,setAbogados] = useState([]);
  const [clientes,setClientes] = useState([]);
  const [exps,setExps]       = useState([]);
  const [modal,setModal]     = useState(null);
  const [areaFocus,setAreaFocus] = useState(null);
  const [expDetail,setExpDetail] = useState(null);
  const [clienteTipo,setClienteTipo] = useState("todos");
  const [expAreaF,setExpAreaF]   = useState("todas");
  const [expEstadoF,setExpEstadoF] = useState("todos");
  const [searchQ,setSearchQ] = useState("");
  const [searchType,setSearchType] = useState("jurisprudencia");
  const [searchRes,setSearchRes] = useState(null);
  const [searching,setSearching] = useState(false);
  const [loading,setLoading] = useState(false);
  const [mLoading,setMLoading] = useState(false);
  const [mErr,setMErr]       = useState("");
  const [exporting,setExporting] = useState(false);
  const [juzgados,setJuzgados]   = useState([]);
  const [modelos,setModelos]     = useState([]);
  const [categorias,setCategorias] = useState([]);
  const [colegios,setColegios]   = useState([]);
  const [juzgFuero,setJuzgFuero] = useState("todos");
  const [juzgQ,setJuzgQ]         = useState("");
  const [modeloTipo,setModeloTipo] = useState("todos");
  const [modeloCat,setModeloCat]   = useState("todas");
  const [modeloSelec,setModeloSelec] = useState(null);
  const [modeloVars,setModeloVars]   = useState({});
  const [juzgDetail,setJuzgDetail]   = useState(null);

  const canEdit = user?.rol !== "abogado" || true; // abogados pueden editar sus propios
  const isAdmin = ["administrador","socio"].includes(user?.rol);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [ab,cl,ex,jz,md,cat,col] = await Promise.all([
        api.get("/api/abogados"),
        api.get("/api/clientes"),
        api.get("/api/expedientes"),
        api.get("/api/juzgados"),
        api.get("/api/modelos"),
        api.get("/api/modelos/categorias"),
        api.get("/api/colegios"),
      ]);
      setAbogados(ab); setClientes(cl); setExps(ex);
      setJuzgados(jz); setModelos(md); setCategorias(cat); setColegios(col);
    } catch(e) { console.error(e); }
    setLoading(false);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLogin = (u) => { setUser(u); };
  const handleLogout = () => { localStorage.removeItem("token"); setUser(null); };

  const saveModal = async (data) => {
    setMLoading(true); setMErr("");
    try {
      if (modal.type === "expediente") {
        if (modal.mode === "new") await api.post("/api/expedientes", data);
        else await api.put(`/api/expedientes/${data.id}`, data);
      } else if (modal.type === "cliente") {
        if (modal.mode === "new") await api.post("/api/clientes", data);
        else await api.put(`/api/clientes/${data.id}`, data);
      } else if (modal.type === "abogado") {
        if (modal.mode === "new") await api.post("/api/abogados", data);
        else await api.put(`/api/abogados/${data.id}`, data);
      } else if (modal.type === "juzgado") {
        if (modal.mode === "new") await api.post("/api/juzgados", data);
        else await api.put(`/api/juzgados/${data.id}`, data);
      }
      setModal(null);
      await loadData();
      // BUG FIX: expDetail queda stale tras editar — actualizar si el expediente editado
      // es el que está en el detalle actualmente abierto
      if (modal.type === 'expediente' && modal.mode === 'edit' && expDetail?.id === data.id) {
        try {
          const updated = await api.get(`/api/expedientes/${data.id}`);
          setExpDetail(updated);
        } catch { /* silencioso */ }
      }
    } catch(e) {
      setMErr(e.message || "Error al guardar");
    }
    setMLoading(false);
  };

  const doSearch = async () => {
    if (!searchQ.trim()) return;
    setSearching(true); setSearchRes(null);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:2000,
          system:"Eres un asistente jurídico especializado en derecho argentino. Responde SOLO con JSON válido, sin texto adicional ni backticks.",
          tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{role:"user",content:`Busca información sobre: "${searchQ}" en ${searchType==="jurisprudencia"?"jurisprudencia argentina (fallos CSJN, Cámaras)":searchType==="doctrina"?"doctrina jurídica argentina":  "legislación argentina vigente"}. Devuelve JSON: {"titulo":"...","tipo":"${searchType}","resultados":[{"titulo":"...","referencia":"...","fecha":"...","resumen":"...","relevancia":"alta|media"}],"nota":"..."}`}]
        })
      });
      const d = await resp.json();
      const txt = d.content?.find(b=>b.type==="text")?.text||"";
      try { setSearchRes(JSON.parse(txt.replace(/```json|```/g,"").trim())); }
      catch { setSearchRes({titulo:searchQ,tipo:searchType,resultados:[],nota:txt,raw:true}); }
    } catch { setSearchRes({error:"Error al conectar."}); }
    setSearching(false);
  };

  const doExport = async (path, filename) => {
    setExporting(true);
    try { await descargar(path, filename); }
    catch(e) { alert("Error al exportar: " + e.message); }
    setExporting(false);
  };

  if (!user) return <LoginScreen onLogin={handleLogin}/>;

  const activeExps = exps.filter(e=>e.estado==="activo");
  const upcoming   = [...activeExps].filter(e=>e.prox_fecha).sort((a,b)=>a.prox_fecha.localeCompare(b.prox_fecha)).slice(0,6);
  const filtExps   = exps.filter(e=>(expAreaF==="todas"||e.area===expAreaF)&&(expEstadoF==="todos"||e.estado===expEstadoF));
  const filtCli    = clientes.filter(c=>clienteTipo==="todos"||c.tipo===clienteTipo);

  return (
    <div style={{display:"flex",minHeight:"100vh",position:"relative",fontFamily:"var(--font-sans)"}}>
      <h2 className="sr-only">Sistema de gestión — Estudio Jurídico</h2>

      {/* SIDEBAR */}
      <nav style={{width:196,background:"var(--color-background-secondary)",borderRight:`0.5px solid ${B}`,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"1.25rem 1rem 1rem",borderBottom:`0.5px solid ${B}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:32,height:32,borderRadius:8,background:"var(--color-background-info)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <i className="ti ti-gavel" style={{fontSize:17,color:"var(--color-text-info)"}} aria-hidden="true"/>
            </div>
            <div><div style={{fontSize:13,fontWeight:500,lineHeight:1.2}}>Estudio Jurídico</div><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Sistema Legal</div></div>
          </div>
        </div>
        <div style={{flex:1,padding:"0.5rem 0"}}>
          {NAV.map(n=>{
            const active = view===n.id;
            return <button key={n.id} onClick={()=>{setView(n.id);setAreaFocus(null);setExpDetail(null);}} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"8px 12px",background:active?"var(--color-background-primary)":"none",border:"none",borderLeft:active?"2px solid var(--color-border-info)":"2px solid transparent",cursor:"pointer",textAlign:"left",color:active?"var(--color-text-primary)":"var(--color-text-secondary)",fontSize:13,fontWeight:active?500:400}}>
              <i className={`ti ${n.icon}`} style={{fontSize:16}} aria-hidden="true"/>{n.label}
            </button>;
          })}
        </div>
        <div style={{padding:"0.75rem 1rem",borderTop:`0.5px solid ${B}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <Avatar name={user.nombre} size={28} color="info"/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.nombre.replace(/^Dr[a]?\.?\s+/i,"")}</div>
              <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{ROL_LABEL[user.rol]||user.rol}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{width:"100%",fontSize:12,display:"flex",alignItems:"center",gap:6,color:"var(--color-text-secondary)",border:`0.5px solid ${B}`,padding:"5px 8px",background:"none"}}>
            <i className="ti ti-logout" style={{fontSize:13}} aria-hidden="true"/>Cerrar sesión
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main style={{flex:1,overflowY:"auto",position:"relative",minWidth:0}}>
        {modal && (
          <Modal title={modal.title} onClose={()=>setModal(null)}>
            {mErr && <div style={{background:"var(--color-background-danger)",color:"var(--color-text-danger)",border:"0.5px solid var(--color-border-danger)",borderRadius:"var(--border-radius-md)",padding:"8px 12px",fontSize:13,marginBottom:12}}>{mErr}</div>}
            {modal.type==="expediente" && <ExpForm initial={modal.data} abogados={abogados} clientes={clientes} onSave={saveModal} onCancel={()=>setModal(null)} loading={mLoading}/>}
            {modal.type==="cliente"    && <ClienteForm initial={modal.data} onSave={saveModal} onCancel={()=>setModal(null)} loading={mLoading}/>}
            {modal.type==="abogado"    && <AbogadoForm initial={modal.data} onSave={saveModal} onCancel={()=>setModal(null)} loading={mLoading}/>}
            {modal.type==="juzgado"    && <JuzgadoForm initial={modal.data} onSave={saveModal} onCancel={()=>setModal(null)} loading={mLoading}/>}
          </Modal>
        )}

        <div style={{padding:"1.5rem"}}>
          {loading && view!=="investigacion" && (
            <div style={{textAlign:"center",padding:"3rem",color:"var(--color-text-secondary)"}}><Spinner/> Cargando...</div>
          )}

          {/* DASHBOARD */}
          {!loading && view==="dashboard" && (
            <div>
              <h1 style={{margin:"0 0 1.25rem",fontSize:20,fontWeight:500}}>Panel General</h1>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:"1.5rem"}}>
                {[
                  {label:"Expedientes activos",val:activeExps.length,icon:"ti-folder-open",c:"info"},
                  {label:"Clientes actuales",val:clientes.filter(c=>c.tipo==="actual").length,icon:"ti-users",c:"success"},
                  {label:"Prospectos",val:clientes.filter(c=>c.tipo==="potencial").length,icon:"ti-user-plus",c:"warning"},
                  {label:"Abogados activos",val:abogados.filter(a=>a.activo).length,icon:"ti-user-circle",c:"secondary"},
                ].map(s=>(
                  <div key={s.label} style={{background:"var(--color-background-secondary)",borderRadius:"var(--border-radius-md)",padding:"0.875rem 1rem",border:`0.5px solid ${B}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{s.label}</span>
                      <i className={`ti ${s.icon}`} style={{fontSize:16,color:`var(--color-text-${s.c})`}} aria-hidden="true"/>
                    </div>
                    <div style={{fontSize:26,fontWeight:500}}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem"}}>
                  <h3 style={{margin:"0 0 1rem",fontSize:14,fontWeight:500}}>Próximas fechas</h3>
                  {upcoming.length===0&&<p style={{fontSize:13,color:"var(--color-text-secondary)",margin:0}}>Sin fechas próximas</p>}
                  {upcoming.map(e=>(
                    <div key={e.id} style={{borderBottom:`0.5px solid ${B}`,paddingBottom:10,marginBottom:10}}>
                      <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.caratula}</div>
                          <div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{e.abogado_nombre?.replace(/^Dr[a]?\.?\s+/i,"")||"—"}</div>
                        </div>
                        <div style={{flexShrink:0,textAlign:"right"}}>
                          <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-warning)"}}>{e.prox_fecha?.slice(0,10)}</div>
                          <AreaBadge area={e.area}/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem"}}>
                  <h3 style={{margin:"0 0 1rem",fontSize:14,fontWeight:500}}>Expedientes por área</h3>
                  {Object.keys(AREAS_DEF).map(area=>{
                    const cnt=activeExps.filter(e=>e.area===area).length;
                    const pct=Math.round((cnt/(activeExps.length||1))*100);
                    const c=colorArea(area);
                    return <div key={area} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <span style={{fontSize:12,width:90,flexShrink:0}}>{area}</span>
                      <div style={{flex:1,background:"var(--color-background-secondary)",borderRadius:4,height:8}}>
                        <div style={{width:`${pct}%`,height:"100%",borderRadius:4,background:`var(--color-text-${c})`,opacity:0.7}}/>
                      </div>
                      <span style={{fontSize:12,fontWeight:500,width:24,textAlign:"right"}}>{cnt}</span>
                    </div>;
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ÁREAS */}
          {!loading && view==="areas" && !areaFocus && (
            <div>
              <h1 style={{margin:"0 0 1.25rem",fontSize:20,fontWeight:500}}>Áreas del Estudio</h1>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {Object.entries(AREAS_DEF).map(([area,cfg])=>{
                  const cnt=activeExps.filter(e=>e.area===area).length;
                  const c=colorArea(area);
                  return <div key={area} onClick={()=>setAreaFocus(area)} style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.25rem",cursor:"pointer"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=`var(--color-border-${c})`}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=B}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                      <div style={{width:40,height:40,borderRadius:"var(--border-radius-md)",background:`var(--color-background-${c})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <i className={`ti ${cfg.icon}`} style={{fontSize:20,color:`var(--color-text-${c})`}} aria-hidden="true"/>
                      </div>
                      <span style={{background:`var(--color-background-${c})`,color:`var(--color-text-${c})`,fontSize:13,fontWeight:500,padding:"3px 10px",borderRadius:20,alignSelf:"flex-start"}}>{cnt} activos</span>
                    </div>
                    <div style={{fontSize:15,fontWeight:500,marginBottom:6}}>{area}</div>
                    <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.5}}>{cfg.desc}</div>
                  </div>;
                })}
              </div>
            </div>
          )}

          {!loading && view==="areas" && areaFocus && (
            <div>
              <button onClick={()=>setAreaFocus(null)} style={{marginBottom:"1rem",fontSize:13,display:"flex",alignItems:"center",gap:5}}>
                <i className="ti ti-arrow-left" style={{fontSize:14}} aria-hidden="true"/> Volver
              </button>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.25rem"}}>
                <div style={{width:44,height:44,borderRadius:"var(--border-radius-md)",background:`var(--color-background-${colorArea(areaFocus)})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <i className={`ti ${AREAS_DEF[areaFocus].icon}`} style={{fontSize:22,color:`var(--color-text-${colorArea(areaFocus)})`}} aria-hidden="true"/>
                </div>
                <div>
                  <h1 style={{margin:0,fontSize:20,fontWeight:500}}>Derecho {areaFocus}</h1>
                  <p style={{margin:0,fontSize:13,color:"var(--color-text-secondary)"}}>{AREAS_DEF[areaFocus].desc}</p>
                </div>
              </div>
              <ExpTable exps={exps.filter(e=>e.area===areaFocus)} onEdit={e=>setModal({type:"expediente",mode:"edit",title:"Editar expediente",data:e})} onDetail={setExpDetail} canEdit={canEdit}/>
            </div>
          )}

          {/* INVESTIGACIÓN */}
          {view==="investigacion" && (
            <div>
              <h1 style={{margin:"0 0 0.5rem",fontSize:20,fontWeight:500}}>Investigación Legal</h1>
              <p style={{margin:"0 0 1.25rem",fontSize:13,color:"var(--color-text-secondary)"}}>Búsqueda asistida por IA en jurisprudencia, doctrina y legislación argentina</p>
              <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.25rem",marginBottom:"1.5rem"}}>
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  {["jurisprudencia","doctrina","legislacion"].map(t=>(
                    <button key={t} onClick={()=>setSearchType(t)} style={{fontSize:13,fontWeight:searchType===t?500:400,background:searchType===t?"var(--color-background-info)":"var(--color-background-secondary)",color:searchType===t?"var(--color-text-info)":"var(--color-text-secondary)",border:searchType===t?"0.5px solid var(--color-border-info)":`0.5px solid ${B}`,borderRadius:20,padding:"4px 14px",cursor:"pointer",textTransform:"capitalize"}}>
                      {t==="legislacion"?"Legislación":t.charAt(0).toUpperCase()+t.slice(1)}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} placeholder={`Buscar en ${searchType==="legislacion"?"legislación":searchType}...`} style={{flex:1}}/>
                  <button onClick={doSearch} disabled={searching} style={{background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)",display:"flex",alignItems:"center",gap:6,padding:"0 16px"}}>
                    {searching?<Spinner/>:<i className="ti ti-search" aria-hidden="true"/>}
                    {searching?"Buscando...":"Buscar"}
                  </button>
                </div>
              </div>
              {searchRes && !searchRes.error && !searchRes.raw && (
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <h3 style={{margin:0,fontSize:15,fontWeight:500}}>{searchRes.titulo}</h3>
                    <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{searchRes.resultados?.length||0} resultado(s)</span>
                  </div>
                  {searchRes.nota && <div style={{background:"var(--color-background-warning)",border:"0.5px solid var(--color-border-warning)",borderRadius:"var(--border-radius-md)",padding:"10px 14px",fontSize:12,color:"var(--color-text-warning)",marginBottom:14}}>{searchRes.nota}</div>}
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {(searchRes.resultados||[]).map((r,i)=>(
                      <div key={i} style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1rem 1.25rem",borderLeft:`3px solid var(--color-border-${r.relevancia==="alta"?"info":"secondary"})`}}>
                        <div style={{display:"flex",justifyContent:"space-between",gap:10,marginBottom:6}}>
                          <div style={{fontSize:14,fontWeight:500}}>{r.titulo}</div>
                          <div style={{flexShrink:0,display:"flex",gap:6,alignItems:"center"}}>
                            {r.relevancia==="alta"&&<Badge v="activo"/>}
                            <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{r.fecha}</span>
                          </div>
                        </div>
                        <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:6}}>{r.referencia}</div>
                        <div style={{fontSize:13,lineHeight:1.5}}>{r.resumen}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {searchRes?.raw && <div style={{fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{searchRes.nota}</div>}
              {searchRes?.error && <div style={{color:"var(--color-text-danger)",fontSize:13}}>{searchRes.error}</div>}
              {!searchRes && !searching && <div style={{textAlign:"center",padding:"2.5rem",color:"var(--color-text-secondary)"}}>
                <i className="ti ti-books" style={{fontSize:40,display:"block",marginBottom:12}} aria-hidden="true"/>
                <p style={{margin:0,fontSize:14}}>Realizá tu búsqueda para obtener resultados de jurisprudencia, doctrina o legislación argentina</p>
              </div>}
            </div>
          )}

          {/* EXPEDIENTES */}
          {!loading && view==="expedientes" && !expDetail && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
                <h1 style={{margin:0,fontSize:20,fontWeight:500}}>Expedientes</h1>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>{
                    const p = new URLSearchParams();
                    if (expAreaF  !== 'todas') p.set('area',   expAreaF);
                    if (expEstadoF !== 'todos') p.set('estado', expEstadoF);
                    doExport(`/api/exportar/expedientes/pdf?${p}`, `expedientes-${Date.now()}.pdf`);
                  }} disabled={exporting} style={{fontSize:13,display:"flex",alignItems:"center",gap:5,color:"var(--color-text-danger)",border:"0.5px solid var(--color-border-danger)",background:"var(--color-background-danger)"}}>
                    <i className="ti ti-file-type-pdf" aria-hidden="true"/> PDF
                  </button>
                  <button onClick={()=>{
                    const p = new URLSearchParams();
                    if (expAreaF  !== 'todas') p.set('area',   expAreaF);
                    if (expEstadoF !== 'todos') p.set('estado', expEstadoF);
                    doExport(`/api/exportar/expedientes/excel?${p}`, `expedientes-${Date.now()}.xlsx`);
                  }} disabled={exporting} style={{fontSize:13,display:"flex",alignItems:"center",gap:5,color:"var(--color-text-success)",border:"0.5px solid var(--color-border-success)",background:"var(--color-background-success)"}}>
                    <i className="ti ti-file-type-xls" aria-hidden="true"/> Excel
                  </button>
                  {canEdit && <button onClick={()=>setModal({type:"expediente",mode:"new",title:"Nuevo expediente",data:null})} style={{fontSize:13,display:"flex",alignItems:"center",gap:6,background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)"}}>
                    <i className="ti ti-plus" aria-hidden="true"/> Nuevo
                  </button>}
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                <select value={expAreaF} onChange={e=>setExpAreaF(e.target.value)} style={{fontSize:13}}>
                  <option value="todas">Todas las áreas</option>
                  {Object.keys(AREAS_DEF).map(a=><option key={a}>{a}</option>)}
                </select>
                <select value={expEstadoF} onChange={e=>setExpEstadoF(e.target.value)} style={{fontSize:13}}>
                  <option value="todos">Todos los estados</option>
                  <option value="activo">Activos</option>
                  <option value="cerrado">Cerrados</option>
                  <option value="suspendido">Suspendidos</option>
                </select>
                <span style={{fontSize:13,color:"var(--color-text-secondary)",alignSelf:"center"}}>{filtExps.length} expediente(s)</span>
              </div>
              <ExpTable exps={filtExps} onEdit={e=>setModal({type:"expediente",mode:"edit",title:"Editar expediente",data:e})} onDetail={setExpDetail} canEdit={canEdit}/>
            </div>
          )}

          {!loading && view==="expedientes" && expDetail && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
                <button onClick={()=>setExpDetail(null)} style={{fontSize:13,display:"flex",alignItems:"center",gap:5}}>
                  <i className="ti ti-arrow-left" style={{fontSize:14}} aria-hidden="true"/> Volver
                </button>
                {canEdit && <button onClick={()=>setModal({type:"expediente",mode:"edit",title:"Editar expediente",data:expDetail})}>
                  <i className="ti ti-edit" aria-hidden="true"/> Editar
                </button>}
              </div>
              <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.5rem",borderLeft:`3px solid var(--color-border-${colorArea(expDetail.area)})`}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:16}}>
                  <div>
                    <div style={{fontSize:12,color:"var(--color-text-secondary)",fontFamily:"var(--font-mono)",marginBottom:4}}>{expDetail.numero}</div>
                    <h2 style={{margin:0,fontSize:17,fontWeight:500,lineHeight:1.3}}>{expDetail.caratula}</h2>
                  </div>
                  <div style={{display:"flex",gap:8,flexShrink:0}}>
                    <AreaBadge area={expDetail.area}/><Badge v={expDetail.estado}/>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,borderTop:`0.5px solid ${B}`,paddingTop:16}}>
                  <div><div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>Juzgado / Organismo</div><div style={{fontSize:13}}>{expDetail.juzgado||"—"}</div></div>
                  <div><div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>Apertura</div><div style={{fontSize:13}}>{expDetail.apertura?.slice(0,10)||"—"}</div></div>
                  <div><div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>Próxima fecha</div><div style={{fontSize:13,fontWeight:expDetail.prox_fecha?500:400,color:expDetail.prox_fecha?"var(--color-text-warning)":"inherit"}}>{expDetail.prox_fecha?.slice(0,10)||"—"}</div></div>
                  <div><div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:6}}>Abogado</div>
                    {expDetail.abogado_nombre && <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <Avatar name={expDetail.abogado_nombre} size={32} color="info"/>
                      <div><div style={{fontSize:13,fontWeight:500}}>{expDetail.abogado_nombre}</div><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{expDetail.abogado_especialidad}</div></div>
                    </div>}
                  </div>
                  <div><div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>Cliente</div><div style={{fontSize:13,fontWeight:500}}>{expDetail.cliente_razon||"—"}</div><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{expDetail.cliente_email}</div></div>
                </div>
                {expDetail.notas && <div style={{marginTop:16,borderTop:`0.5px solid ${B}`,paddingTop:14}}>
                  <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>Notas</div>
                  <div style={{fontSize:13,lineHeight:1.5}}>{expDetail.notas}</div>
                </div>}
              </div>
            </div>
          )}

          {/* CLIENTES */}
          {!loading && view==="clientes" && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
                <h1 style={{margin:0,fontSize:20,fontWeight:500}}>Clientes</h1>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>doExport("/api/exportar/clientes/excel",`clientes-${Date.now()}.xlsx`)} disabled={exporting} style={{fontSize:13,display:"flex",alignItems:"center",gap:5,color:"var(--color-text-success)",border:"0.5px solid var(--color-border-success)",background:"var(--color-background-success)"}}>
                    <i className="ti ti-file-type-xls" aria-hidden="true"/> Excel
                  </button>
                  {isAdmin && <button onClick={()=>setModal({type:"cliente",mode:"new",title:"Nuevo cliente",data:null})} style={{fontSize:13,display:"flex",alignItems:"center",gap:6,background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)"}}>
                    <i className="ti ti-plus" aria-hidden="true"/> Nuevo
                  </button>}
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:14}}>
                {["todos","actual","potencial"].map(t=>(
                  <button key={t} onClick={()=>setClienteTipo(t)} style={{fontSize:13,background:clienteTipo===t?"var(--color-background-info)":"var(--color-background-secondary)",color:clienteTipo===t?"var(--color-text-info)":"var(--color-text-secondary)",border:clienteTipo===t?"0.5px solid var(--color-border-info)":`0.5px solid ${B}`,borderRadius:20,padding:"4px 14px",cursor:"pointer"}}>
                    {t==="todos"?"Todos":t==="actual"?"Actuales":"Potenciales"}
                  </button>
                ))}
                <span style={{fontSize:13,color:"var(--color-text-secondary)",alignSelf:"center"}}>{filtCli.length} cliente(s)</span>
              </div>
              <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,tableLayout:"fixed"}}>
                  <thead>
                    <tr style={{background:"var(--color-background-secondary)"}}>
                      {["Razón social","Tipo","Área","Contacto","Email",""].map((h,i)=>(
                        <th key={i} style={{padding:"10px 12px",textAlign:"left",fontWeight:500,borderBottom:`0.5px solid ${B}`,width:["28%","10%","12%","17%","24%","9%"][i]}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtCli.map((c,i)=>(
                      <tr key={c.id} style={{borderBottom:i<filtCli.length-1?`0.5px solid ${B}`:"none"}}>
                        <td style={{padding:"10px 12px",overflow:"hidden"}}>
                          <div style={{fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.razon}</div>
                          {c.cuit&&<div style={{fontSize:11,color:"var(--color-text-secondary)"}}>CUIT {c.cuit}</div>}
                        </td>
                        <td style={{padding:"10px 12px"}}><Badge v={c.tipo}/></td>
                        <td style={{padding:"10px 12px"}}><AreaBadge area={c.area}/></td>
                        <td style={{padding:"10px 12px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.contacto}</td>
                        <td style={{padding:"10px 12px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:12,color:"var(--color-text-secondary)"}}>{c.email}</td>
                        <td style={{padding:"10px 6px",textAlign:"center"}}>
                          {isAdmin && <button onClick={()=>setModal({type:"cliente",mode:"edit",title:"Editar cliente",data:c})} style={{padding:"4px 8px",fontSize:12}}><i className="ti ti-edit" aria-hidden="true"/></button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ABOGADOS */}
          {!loading && view==="abogados" && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
                <h1 style={{margin:0,fontSize:20,fontWeight:500}}>Abogados</h1>
                {isAdmin && <button onClick={()=>setModal({type:"abogado",mode:"new",title:"Nuevo abogado",data:null})} style={{fontSize:13,display:"flex",alignItems:"center",gap:6,background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)"}}>
                  <i className="ti ti-plus" aria-hidden="true"/> Nuevo
                </button>}
              </div>

              {/* Sector 1: Abogados del estudio */}
              <div style={{marginBottom:"1.5rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <div style={{width:4,height:18,background:"var(--color-border-info)",borderRadius:2}}/>
                  <h2 style={{margin:0,fontSize:15,fontWeight:500}}>Abogados del Estudio</h2>
                  <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{abogados.filter(a=>a.tipo==="interno"||!a.tipo).length} profesional(es)</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {abogados.filter(a=>a.tipo==="interno"||!a.tipo).map(a=>(
                    <AbogadoCard key={a.id} a={a} colegios={colegios} isAdmin={isAdmin} onEdit={()=>setModal({type:"abogado",mode:"edit",title:"Editar abogado",data:a})} B={B}/>
                  ))}
                  {abogados.filter(a=>a.tipo==="interno"||!a.tipo).length===0&&(
                    <div style={{fontSize:13,color:"var(--color-text-secondary)",gridColumn:"1/-1",padding:"1rem 0"}}>No hay abogados del estudio cargados.</div>
                  )}
                </div>
              </div>

              {/* Sector 2: Abogados externos */}
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <div style={{width:4,height:18,background:"var(--color-border-warning)",borderRadius:2}}/>
                  <h2 style={{margin:0,fontSize:15,fontWeight:500}}>Abogados Externos / Partes Contrarias</h2>
                  <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{abogados.filter(a=>a.tipo==="externo").length} profesional(es)</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {abogados.filter(a=>a.tipo==="externo").map(a=>(
                    <AbogadoCard key={a.id} a={a} colegios={colegios} isAdmin={isAdmin} onEdit={()=>setModal({type:"abogado",mode:"edit",title:"Editar abogado",data:a})} B={B} externo/>
                  ))}
                  {abogados.filter(a=>a.tipo==="externo").length===0&&(
                    <div style={{fontSize:13,color:"var(--color-text-secondary)",gridColumn:"1/-1",padding:"1rem 0"}}>No hay abogados externos registrados.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* JUZGADOS */}
          {!loading && view==="juzgados" && !juzgDetail && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
                <h1 style={{margin:0,fontSize:20,fontWeight:500}}>Base de Juzgados</h1>
                {isAdmin && <button onClick={()=>setModal({type:"juzgado",mode:"new",title:"Nuevo juzgado",data:null})} style={{fontSize:13,display:"flex",alignItems:"center",gap:6,background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)"}}>
                  <i className="ti ti-plus" aria-hidden="true"/> Nuevo
                </button>}
              </div>
              <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                <select value={juzgFuero} onChange={e=>setJuzgFuero(e.target.value)} style={{fontSize:13}}>
                  <option value="todos">Todos los fueros</option>
                  {[...new Set(juzgados.map(j=>j.fuero))].sort().map(f=><option key={f}>{f}</option>)}
                </select>
                <input value={juzgQ} onChange={e=>setJuzgQ(e.target.value)} placeholder="Buscar por nombre, juez, calle..." style={{fontSize:13,flex:1,minWidth:200}}/>
                <span style={{fontSize:13,color:"var(--color-text-secondary)",alignSelf:"center"}}>
                  {juzgados.filter(j=>(juzgFuero==="todos"||j.fuero===juzgFuero)&&(!juzgQ||j.nombre.toLowerCase().includes(juzgQ.toLowerCase())||((j.nombre_juez||"").toLowerCase().includes(juzgQ.toLowerCase()))||(j.calle||"").toLowerCase().includes(juzgQ.toLowerCase()))).length} juzgado(s)
                </span>
              </div>
              <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,tableLayout:"fixed"}}>
                  <thead>
                    <tr style={{background:"var(--color-background-secondary)"}}>
                      {["Nombre","Fuero","Juez/a","Domicilio","Teléfono",""].map((h,i)=>(
                        <th key={i} style={{padding:"10px 12px",textAlign:"left",fontWeight:500,borderBottom:`0.5px solid ${B}`,width:["32%","12%","18%","22%","12%","4%"][i]}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {juzgados
                      .filter(j=>(juzgFuero==="todos"||j.fuero===juzgFuero)&&(!juzgQ||[j.nombre,j.nombre_juez||"",j.calle||""].join(" ").toLowerCase().includes(juzgQ.toLowerCase())))
                      .map((j,i,arr)=>(
                      <tr key={j.id} style={{borderBottom:i<arr.length-1?`0.5px solid ${B}`:"none"}}>
                        <td style={{padding:"10px 12px",overflow:"hidden"}}>
                          <div style={{fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:13}}>{j.nombre}</div>
                          {j.total_secretarias>0&&<div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{j.total_secretarias} secretaría(s)</div>}
                        </td>
                        <td style={{padding:"10px 12px"}}><AreaBadge area={j.fuero}/></td>
                        <td style={{padding:"10px 12px",fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.nombre_juez||"—"}</td>
                        <td style={{padding:"10px 12px",fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{[j.calle,j.numero_calle,j.piso?"Piso "+j.piso:null].filter(Boolean).join(" ")||"—"}</td>
                        <td style={{padding:"10px 12px",fontSize:12,color:"var(--color-text-secondary)"}}>{j.telefono||"—"}</td>
                        <td style={{padding:"10px 6px",textAlign:"center"}}>
                          <button onClick={()=>setJuzgDetail(j)} style={{padding:"4px 6px",fontSize:12}} title="Ver"><i className="ti ti-eye" aria-hidden="true"/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {!loading && view==="juzgados" && juzgDetail && (
            <div>
              <button onClick={()=>setJuzgDetail(null)} style={{marginBottom:"1rem",fontSize:13,display:"flex",alignItems:"center",gap:5}}>
                <i className="ti ti-arrow-left" style={{fontSize:14}} aria-hidden="true"/> Volver
              </button>
              <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.5rem",borderLeft:`3px solid var(--color-border-info)`}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:16}}>
                  <div>
                    <h2 style={{margin:"0 0 4px",fontSize:18,fontWeight:500}}>{juzgDetail.nombre}</h2>
                    <div style={{display:"flex",gap:8}}><AreaBadge area={juzgDetail.fuero}/><span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{juzgDetail.jurisdiccion}</span></div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,borderTop:`0.5px solid ${B}`,paddingTop:16}}>
                  <div><div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>Juez/a titular</div><div style={{fontSize:13,fontWeight:500}}>{juzgDetail.nombre_juez||"Vacante"}</div></div>
                  <div><div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>Cámara</div><div style={{fontSize:13}}>{juzgDetail.camara||"—"}</div></div>
                  <div><div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>Domicilio</div><div style={{fontSize:13}}>{[juzgDetail.calle,juzgDetail.numero_calle,juzgDetail.piso&&("Piso "+juzgDetail.piso),juzgDetail.cp,juzgDetail.localidad].filter(Boolean).join(", ")||"—"}</div></div>
                  <div><div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>Teléfono / Email</div><div style={{fontSize:13}}>{juzgDetail.telefono||"—"}{juzgDetail.email&&<><br/><span style={{color:"var(--color-text-secondary)"}}>{juzgDetail.email}</span></>}</div></div>
                </div>
                {juzgDetail.observaciones&&<div style={{marginTop:14,borderTop:`0.5px solid ${B}`,paddingTop:12}}>
                  <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>Observaciones</div>
                  <div style={{fontSize:13}}>{juzgDetail.observaciones}</div>
                </div>}
              </div>
              {juzgDetail.secretarias?.length>0&&(
                <div style={{marginTop:14}}>
                  <h3 style={{fontSize:14,fontWeight:500,margin:"0 0 10px"}}>Secretarías</h3>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {juzgDetail.secretarias.map(s=>(
                      <div key={s.id} style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-md)",padding:"0.875rem 1rem"}}>
                        <div style={{fontWeight:500,fontSize:13,marginBottom:4}}>Secretaría {s.numero}</div>
                        <div style={{fontSize:12}}>{s.nombre_secretario||"—"}</div>
                        <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{[s.telefono,s.telefono_int&&("Int. "+s.telefono_int)].filter(Boolean).join(" · ")||"—"}</div>
                        {s.email&&<div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{s.email}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODELOS */}
          {!loading && view==="modelos" && !modeloSelec && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.25rem"}}>
                <h1 style={{margin:0,fontSize:20,fontWeight:500}}>Modelos de Escritos y Contratos</h1>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                {["todos","escrito","contrato"].map(t=>(
                  <button key={t} onClick={()=>{setModeloTipo(t);setModeloCat("todas");}} style={{fontSize:13,background:modeloTipo===t?"var(--color-background-info)":"var(--color-background-secondary)",color:modeloTipo===t?"var(--color-text-info)":"var(--color-text-secondary)",border:modeloTipo===t?"0.5px solid var(--color-border-info)":`0.5px solid ${B}`,borderRadius:20,padding:"4px 14px",cursor:"pointer",textTransform:"capitalize"}}>
                    {t==="todos"?"Todos":t==="escrito"?"Escritos":"Contratos"}
                  </button>
                ))}
                <select value={modeloCat} onChange={e=>setModeloCat(e.target.value)} style={{fontSize:13,marginLeft:8}}>
                  <option value="todas">Todas las categorías</option>
                  {categorias.filter(c=>modeloTipo==="todos"||c.tipo===modeloTipo).map(c=><option key={c.id} value={String(c.id)}>{c.nombre}</option>)}
                </select>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {modelos
                  .filter(m=>(modeloTipo==="todos"||m.categoria_tipo===modeloTipo)&&(modeloCat==="todas"||String(m.id_categoria)===modeloCat))
                  .map(m=>{
                    const tipo = m.categoria_tipo;
                    const c = tipo==="escrito"?"info":"success";
                    return (
                      <div key={m.id} style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.25rem",cursor:"pointer"}}
                        onClick={async()=>{
                          try {
                            const full = await api.get(`/api/modelos/${m.id}`);
                            setModeloSelec(full);
                            setModeloVars({});
                          } catch(e){alert("Error al cargar modelo");}
                        }}
                        onMouseEnter={e=>e.currentTarget.style.borderColor=`var(--color-border-${c})`}
                        onMouseLeave={e=>e.currentTarget.style.borderColor=B}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                          <div style={{width:36,height:36,borderRadius:"var(--border-radius-md)",background:`var(--color-background-${c})`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <i className={`ti ${tipo==="escrito"?"ti-file-description":"ti-contract"}`} style={{fontSize:18,color:`var(--color-text-${c})`}} aria-hidden="true"/>
                          </div>
                          <div style={{display:"flex",gap:6,alignItems:"flex-start"}}>
                            <span style={{background:`var(--color-background-${c})`,color:`var(--color-text-${c})`,fontSize:11,padding:"2px 8px",borderRadius:20}}>{tipo}</span>
                            {m.area&&<AreaBadge area={m.area}/>}
                          </div>
                        </div>
                        <div style={{fontSize:14,fontWeight:500,marginBottom:4}}>{m.nombre}</div>
                        <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.4}}>{m.descripcion}</div>
                        <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:8}}>{m.categoria_nombre} · v{m.version}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {!loading && view==="modelos" && modeloSelec && (
            <ModeloViewer modelo={modeloSelec} vars={modeloVars} setVars={setModeloVars} onBack={()=>setModeloSelec(null)}/>
          )}

        </div>
      </main>
    </div>
  );
}

// ── ModeloViewer — rellena variables y genera vista previa ─
// ── AbogadoCard — muestra datos + matrículas por colegio ──
function AbogadoCard({ a, isAdmin, onEdit, B, externo }) {
  const [matriculas, setMatriculas] = useState(null);
  const [expanded, setExpanded]     = useState(false);
  const color = externo ? "warning" : "info";

  const loadMatriculas = async () => {
    if (matriculas !== null) { setExpanded(e=>!e); return; }
    try {
      const r = await api.get(`/api/matriculas/abogado/${a.id}`);
      setMatriculas(r);
      setExpanded(true);
    } catch { setMatriculas([]); setExpanded(true); }
  };

  return (
    <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1.25rem",opacity:a.activo?1:0.65}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Avatar name={a.nombre} size={40} color={a.activo?color:"secondary"}/>
          <div>
            <div style={{fontSize:14,fontWeight:500}}>{a.nombre}</div>
            <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{a.matricula||a.especialidad||"Sin matrícula principal"}</div>
            {a.dni&&<div style={{fontSize:11,color:"var(--color-text-secondary)"}}>DNI: {a.dni}</div>}
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {isAdmin && <button onClick={onEdit} style={{padding:"4px 8px",fontSize:12}} title="Editar"><i className="ti ti-edit" aria-hidden="true"/></button>}
        </div>
      </div>
      <div style={{borderTop:`0.5px solid ${B}`,paddingTop:10,display:"flex",flexDirection:"column",gap:5}}>
        {a.especialidad&&<div style={{display:"flex",gap:8,alignItems:"center"}}><i className="ti ti-books" style={{fontSize:13,color:"var(--color-text-secondary)",width:16}} aria-hidden="true"/><span style={{fontSize:12}}>{a.especialidad}</span></div>}
        {a.email&&<div style={{display:"flex",gap:8,alignItems:"center"}}><i className="ti ti-mail" style={{fontSize:13,color:"var(--color-text-secondary)",width:16}} aria-hidden="true"/><span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{a.email}</span></div>}
        {(a.tel||a.celular)&&<div style={{display:"flex",gap:8,alignItems:"center"}}><i className="ti ti-phone" style={{fontSize:13,color:"var(--color-text-secondary)",width:16}} aria-hidden="true"/><span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{a.celular||a.tel}</span></div>}
        {a.domicilio&&<div style={{display:"flex",gap:8,alignItems:"center"}}><i className="ti ti-map-pin" style={{fontSize:13,color:"var(--color-text-secondary)",width:16}} aria-hidden="true"/><span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{a.domicilio}{a.localidad?", "+a.localidad:""}</span></div>}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4,alignItems:"center"}}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:12,color:"var(--color-text-secondary)"}}><i className="ti ti-folder-open" style={{fontSize:12}} aria-hidden="true"/> {a.exp_activos||0} exp.</span>
            <button onClick={loadMatriculas} style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:`var(--color-background-${color})`,color:`var(--color-text-${color})`,border:`0.5px solid var(--color-border-${color})`}}>
              <i className="ti ti-certificate" style={{fontSize:11,marginRight:4}} aria-hidden="true"/>Matrículas
            </button>
          </div>
          <Badge v={a.activo?"activo":"cerrado"}/>
        </div>
        {expanded && matriculas !== null && (
          <div style={{marginTop:8,borderTop:`0.5px solid ${B}`,paddingTop:8}}>
            {matriculas.length===0
              ? <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>Sin matrículas registradas.</div>
              : matriculas.map(m=>(
                <div key={m.id} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4,padding:"4px 0",borderBottom:`0.5px solid ${B}`}}>
                  <div>
                    <span style={{fontWeight:500}}>{m.colegio_sigla}</span>
                    <span style={{color:"var(--color-text-secondary)",marginLeft:6}}>{m.colegio_nombre}</span>
                  </div>
                  <div style={{textAlign:"right"}}>
                    {m.tomo&&<span>T.{m.tomo}</span>}{m.folio&&<span> F.{m.folio}</span>}
                    <span style={{marginLeft:8,fontSize:11,background:m.estado==="activa"?"var(--color-background-success)":"var(--color-background-warning)",color:m.estado==="activa"?"var(--color-text-success)":"var(--color-text-warning)",padding:"1px 6px",borderRadius:10}}>{m.estado}</span>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

function ModeloViewer({ modelo, vars, setVars, onBack }) {
  const B = "var(--color-border-tertiary)";
  const [tab, setTab] = useState("editor"); // editor | preview
  const [copied, setCopied] = useState(false);

  const renderContent = () => {
    let text = modelo.contenido || "";
    (modelo.variables || []).forEach(v => {
      const val = vars[v.campo] || `[${v.label}]`;
      text = text.replaceAll(`{{${v.campo}}}`, val);
    });
    return text;
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(renderContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { alert("No se pudo copiar. Seleccioná el texto manualmente."); }
  };

  const printDoc = () => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>${modelo.nombre}</title>
    <style>body{font-family:Times New Roman,serif;font-size:12pt;line-height:1.8;margin:3cm 3cm 3cm 3.5cm;color:#000;white-space:pre-wrap}</style></head>
    <body>${renderContent().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div>
      <button onClick={onBack} style={{marginBottom:"1rem",fontSize:13,display:"flex",alignItems:"center",gap:5}}>
        <i className="ti ti-arrow-left" style={{fontSize:14}} aria-hidden="true"/> Volver a modelos
      </button>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem",flexWrap:"wrap",gap:8}}>
        <div>
          <h1 style={{margin:"0 0 4px",fontSize:18,fontWeight:500}}>{modelo.nombre}</h1>
          <div style={{display:"flex",gap:8}}>
            <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>{modelo.categoria_nombre}</span>
            {modelo.area&&<AreaBadge area={modelo.area}/>}
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={copyText} style={{fontSize:13,display:"flex",alignItems:"center",gap:5}}>
            <i className={`ti ${copied?"ti-check":"ti-copy"}`} aria-hidden="true"/>
            {copied?"¡Copiado!":"Copiar texto"}
          </button>
          <button onClick={printDoc} style={{fontSize:13,display:"flex",alignItems:"center",gap:5,background:"var(--color-background-info)",color:"var(--color-text-info)",border:"0.5px solid var(--color-border-info)"}}>
            <i className="ti ti-printer" aria-hidden="true"/> Imprimir / PDF
          </button>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:14,alignItems:"flex-start"}}>
        {/* Panel de variables */}
        {modelo.variables?.length > 0 && (
          <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"1rem"}}>
            <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:500}}>Completar datos</h3>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {modelo.variables.map(v => (
                <div key={v.campo}>
                  <label style={{fontSize:11,color:"var(--color-text-secondary)",display:"block",marginBottom:3}}>{v.label}</label>
                  {v.tipo==="textarea"
                    ? <textarea value={vars[v.campo]||""} onChange={e=>setVars(p=>({...p,[v.campo]:e.target.value}))} rows={3} style={{width:"100%",fontSize:12}}/>
                    : <input type={v.tipo||"text"} value={vars[v.campo]||""} onChange={e=>setVars(p=>({...p,[v.campo]:e.target.value}))} style={{width:"100%",fontSize:12}}/>
                  }
                </div>
              ))}
              <button onClick={()=>setVars({})} style={{fontSize:12,marginTop:4,color:"var(--color-text-secondary)"}}>
                Limpiar datos
              </button>
            </div>
          </div>
        )}

        {/* Vista del documento */}
        <div style={{background:"var(--color-background-primary)",border:`0.5px solid ${B}`,borderRadius:"var(--border-radius-lg)",padding:"2rem",fontFamily:"'Times New Roman',Georgia,serif",fontSize:13,lineHeight:1.8,whiteSpace:"pre-wrap",minHeight:400,color:"var(--color-text-primary)"}}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
