import { useState } from "react";
import type { BookingItem } from "../types";
import { bookingDate, bookingTime, canCancelBooking } from "../utils/dates";
import Button from "./Button";
import Icon from "./Icon";
import BookingDetailModal from "./BookingDetailModal";
import { api } from "../services/api";

export default function Bookings({
  onExplore,
  bookings,
  onCancel,
}: {
  onExplore: () => void;
  bookings: BookingItem[];
  onCancel: (id: string) => void;
}) {
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
  const [detailBooking, setDetailBooking] = useState<BookingItem | null>(null);
  const upcoming = bookings.filter(
    (booking) => booking.status === "Confirmada",
  );
  const history = bookings.filter((booking) => booking.status === "Cancelada");
  const visibleBookings = tab === "upcoming" ? upcoming : history;

  return (
    <main className="account-page section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Mi cuenta</p>
          <h1>Mis reservaciones</h1>
        </div>
        <Button onClick={onExplore}>Nueva reservación</Button>
      </div>
      <div className="booking-tabs">
        <button
          className={tab === "upcoming" ? "active" : ""}
          onClick={() => setTab("upcoming")}
        >
          Próximas <span>{upcoming.length}</span>
        </button>
        <button
          className={tab === "history" ? "active" : ""}
          onClick={() => setTab("history")}
        >
          Historial {history.length > 0 && <span>{history.length}</span>}
        </button>
      </div>
      {visibleBookings.length > 0 ? (
        <div className="booking-list">
          {visibleBookings.map((booking) => (
            <article
              className={
                booking.status === "Cancelada"
                  ? "booking-card cancelled"
                  : "booking-card"
              }
              key={booking.id}
            >
              <img src={booking.image} alt={booking.roomName} />
              <div className="booking-info">
                <div className="status">{booking.status}</div>
                <p>Confirmación #{booking.id}</p>
                <h2>{booking.roomName}</h2>
                <div className="booking-dates">
                  <div>
                    <small>Llegada</small>
                    <strong>{bookingDate(booking.checkIn)}</strong>
                    <span>{bookingTime(booking.checkIn)} h</span>
                  </div>
                  <Icon name="arrow" />
                  <div>
                    <small>Salida</small>
                    <strong>{bookingDate(booking.checkOut)}</strong>
                    <span>{bookingTime(booking.checkOut)} h</span>
                  </div>
                </div>
              </div>
              <div className="booking-actions">
                <strong>${booking.total.toLocaleString("es-MX")} MXN</strong>
                <span>
                  {booking.status === "Cancelada"
                    ? "Reembolso procesado"
                    : "Pagado"}
                </span>
                {booking.status === "Confirmada" && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => setDetailBooking(booking)}
                    >
                      Ver detalles
                    </Button>
                    {canCancelBooking(booking) ? (
                      <button
                        className="cancel-link"
                        onClick={() => onCancel(booking.id)}
                      >
                        Cancelar reservación
                      </button>
                    ) : (
                      <small className="cancel-unavailable">
                        El periodo de cancelación terminó
                      </small>
                    )}
                  </>
                )}
                {booking.status === "Cancelada" && (
                  <Button
                    variant="secondary"
                    onClick={() => setDetailBooking(booking)}
                  >
                    Ver detalles
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-bookings">
          <Icon name="calendar" size={28} />
          <h2>
            {tab === "upcoming"
              ? "Aún no tienes próximas estancias"
              : "No hay reservaciones en tu historial"}
          </h2>
          <p>Cuando realices o canceles una reservación, aparecerá aquí.</p>
          {tab === "upcoming" && (
            <Button onClick={onExplore}>Explorar habitaciones</Button>
          )}
        </div>
      )}
      {upcoming.length > 0 && tab === "upcoming" && (
        <div className="policy-card">
          <Icon name="calendar" />
          <div>
            <strong>Cancelación flexible</strong>
            <p>
              Puedes cancelar sin costo hasta 24 horas antes de la fecha y hora
              de llegada.
            </p>
          </div>
        </div>
      )}
      {detailBooking && (
        <BookingDetailModal
          booking={detailBooking}
          onClose={() => setDetailBooking(null)}
          onCancel={() => {
            onCancel(detailBooking.id);
            setDetailBooking(null);
          }}
        />
      )}
    </main>
  );
}
