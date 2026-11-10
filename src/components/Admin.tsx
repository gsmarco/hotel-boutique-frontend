import {useEffect,useState} from "react";
import {api} from "../services/api";
import type {Room,BookingItem} from "../types";
import Icon from "./Icon";
import Button from "./Button";

export default function Admin({ onLogout }: { onLogout: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [reservations,setReservations]=useState<(BookingItem & {guest:string})[]>([]);
  const [metrics,setMetrics]=useState<{occupancy:number;occupied:number;rooms:number;arrivals:number;departures:number;revenue:number}|null>(null);
  const [error,setError]=useState("");
  const refresh=async()=>{try {const [r,m]=await Promise.all([api.adminBookings(),api.metrics()]);setReservations(r);setMetrics(m);}catch(e){setError(e instanceof Error?e.message:"Error");}};
  useEffect(()=>{void refresh();},[]);
  const cancel=async(id:string)=>{try {await api.cancelBooking(id);await refresh();}catch(e){setError(e instanceof Error?e.message:"Error");}};
  const createRoom=async(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();const f=new FormData(e.currentTarget);try{await api.createRoom({name:String(f.get("name")),type:String(f.get("type")),price:Number(f.get("price"))});setShowForm(false);await refresh();}catch(e){setError(e instanceof Error?e.message:"Error");}};
  return (
    <main className="admin-page section">
      {error && <p role="alert">{error}</p>}
      <div className="admin-top">
        <div>
          <p className="eyebrow">Panel operativo</p>
          <h1>Buenos días, Andrés</h1>
          <p>Aquí tienes el estado del hotel para hoy.</p>
        </div>
        <div className="admin-actions">
          <Button variant="secondary" onClick={onLogout}>
            <Icon name="logout" size={18} /> Cerrar sesión
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            <Icon name="plus" /> Dar de alta habitación
          </Button>
        </div>
      </div>
      {showForm && (
        <form className="new-room" onSubmit={createRoom}>
          <h3>Nueva habitación</h3>
          <input name="name" required placeholder="Nombre de habitación" />
          <select name="type" defaultValue="Sencilla"><option>Sencilla</option><option>Doble</option><option>Suite</option></select>
          <input name="price" required type="number" min="1" placeholder="Precio por noche" />
          <Button type="submit">Guardar habitación</Button>
        </form>
      )}
      <div className="metrics">
        <div><span>Ocupación hoy</span><strong>{metrics?.occupancy ?? 0}%</strong><small>{metrics?.occupied ?? 0} de {metrics?.rooms ?? 0} habitaciones</small></div>
        <div><span>Llegadas</span><strong>{metrics?.arrivals ?? 0}</strong><small>3 ya registradas</small></div>
        <div><span>Salidas</span><strong>{metrics?.departures ?? 0}</strong><small>Antes de las 12:00 h</small></div>
        <div><span>Ingresos del mes</span><strong>${(metrics?.revenue ?? 0).toLocaleString("es-MX")}</strong><small className="positive">Ingresos confirmados</small></div>
      </div>
      <section className="admin-panel">
        <div className="panel-head">
          <div><h2>Reservaciones recientes</h2><p>Últimos movimientos y estatus.</p></div>
          <div className="search-input"><input placeholder="Buscar reserva..." /></div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Confirmación</th><th>Huésped</th><th>Habitación</th><th>Fechas</th><th>Estatus</th><th>Total</th><th /></tr></thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td><strong>{reservation.id}</strong></td>
                  <td>{reservation.guest}</td><td>{reservation.roomName}</td><td>{reservation.checkIn.slice(0,10)+" – "+reservation.checkOut.slice(0,10)}</td>
                  <td><span className={`status-pill ${reservation.status.toLowerCase()}`}>{reservation.status}</span></td>
                  <td>{reservation.total.toLocaleString("es-MX")}</td>
                  <td>
                    {reservation.status !== "Cancelada" && <button className="table-action" onClick={() => cancel(reservation.id)}>Cancelar</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="inventory">
        <div><h2>Inventario de habitaciones</h2><p>Disponibilidad por categoría</p></div>
        <div className="inventory-bars">
          {[["Habitaciones", Math.max(0,(metrics?.rooms??0)-(metrics?.occupied??0)), metrics?.rooms??0]].map(([label, available, total]) => (
            <div key={label as string}>
              <span>{label}</span>
              <div className="bar"><i style={{ width: `${(Number(available) / Number(total)) * 100}%` }} /></div>
              <strong>{available}/{total}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
