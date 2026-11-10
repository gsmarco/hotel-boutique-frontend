import type {BookingItem} from "../types";
import {bookingDate,bookingTime,canCancelBooking,stayNights} from "../utils/dates";
import Modal from "./Modal";
import Icon from "./Icon";
import Button from "./Button";

export default function BookingDetailModal({
  booking,
  onClose,
  onCancel,
}: {
  booking: BookingItem;
  onClose: () => void;
  onCancel: () => void;
}) {
  const cancellationDeadline = new Date(new Date(booking.checkIn).getTime() - 24 * 60 * 60 * 1000);
  const cancellable = canCancelBooking(booking);
  const nights = stayNights({
    checkIn: booking.checkIn.slice(0, 10),
    checkOut: booking.checkOut.slice(0, 10),
  });

  return (
    <Modal onClose={onClose} wide>
      <div className="booking-detail-head">
        <img src={booking.image} alt={booking.roomName} />
        <div>
          <span className={booking.status === "Cancelada" ? "detail-status cancelled" : "detail-status"}>
            {booking.status}
          </span>
          <p>Confirmación #{booking.id}</p>
          <h2>{booking.roomName}</h2>
          <span>{booking.roomType}</span>
        </div>
      </div>
      <div className="booking-detail-content">
        <div className="booking-detail-grid">
          <section>
            <span className="booking-detail-icon"><Icon name="calendar" size={20} /></span>
            <div><small>Llegada</small><strong>{bookingDate(booking.checkIn)}</strong><span>{bookingTime(booking.checkIn)} h</span></div>
          </section>
          <section>
            <span className="booking-detail-icon"><Icon name="calendar" size={20} /></span>
            <div><small>Salida</small><strong>{bookingDate(booking.checkOut)}</strong><span>{bookingTime(booking.checkOut)} h</span></div>
          </section>
          <section>
            <span className="booking-detail-icon"><Icon name="shield" size={20} /></span>
            <div><small>Método de pago</small><strong>{booking.paymentMethod}</strong><span>Pago procesado de forma segura</span></div>
          </section>
          <section>
            <span className="booking-detail-icon"><Icon name="check" size={20} /></span>
            <div><small>Total pagado</small><strong>${booking.total.toLocaleString("es-MX")} MXN</strong><span>Impuestos incluidos</span></div>
          </section>
        </div>
        <div className="payment-breakdown">
          <h3>Detalle del pago</h3>
          <dl>
            <div><dt>Hospedaje · {nights} {nights === 1 ? "noche" : "noches"}</dt><dd>${(booking.total - 620).toLocaleString("es-MX")} MXN</dd></div>
            <div><dt>Impuestos y servicio</dt><dd>$620 MXN</dd></div>
            <div className="payment-total"><dt>Total pagado</dt><dd>${booking.total.toLocaleString("es-MX")} MXN</dd></div>
          </dl>
        </div>
        {booking.status === "Confirmada" && (
          <div className={cancellable ? "detail-cancel-note" : "detail-cancel-note unavailable"}>
            <Icon name="calendar" size={20} />
            <div>
              <strong>{cancellable ? "Cancelación disponible" : "Esta reservación ya no puede cancelarse"}</strong>
              <p>
                {cancellable
                  ? `Puedes cancelar sin costo hasta el ${bookingDate(cancellationDeadline.toISOString())} a las ${bookingTime(cancellationDeadline.toISOString())} h.`
                  : "La cancelación solo está disponible hasta 24 horas antes de la llegada."}
              </p>
            </div>
            {cancellable && <Button variant="danger" onClick={onCancel}>Cancelar reservación</Button>}
          </div>
        )}
      </div>
    </Modal>
  );
}
