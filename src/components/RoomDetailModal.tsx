import {useState} from "react";
import type {Room,StayDates} from "../types";
import {photos} from "../utils/data";
import {stayNights,stayDateLabel} from "../utils/dates";
import Modal from "./Modal";
import Icon from "./Icon";
import Button from "./Button";

export default function RoomDetailModal({
  room,
  dates,
  onClose,
  onReserve,
}: {
  room: Room;
  dates: StayDates;
  onClose: () => void;
  onReserve: () => void;
}) {
  const gallery = [room.image, photos.hero, room.type === "Suite" ? photos.doble : photos.suite];
  const nights = stayNights(dates);
  const total = room.price * nights;
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  return (
    <Modal onClose={onClose} full>
      <div className="room-detail">
        <div className="detail-gallery">
          {gallery.map((image, index) => (
            <button
              key={image}
              onClick={() => setZoomIndex(index)}
              aria-label={`Ampliar fotografía ${index + 1} de ${room.name}`}
            >
              <img
                src={image}
                alt={
                  index === 0
                    ? `Habitación ${room.name}`
                    : index === 1
                      ? "Terraza del hotel con vista al océano"
                      : "Espacio interior de Hotel Boutique Real"
                }
              />
            </button>
          ))}
          <span><Icon name="sparkle" size={14} /> Ver 3 fotografías</span>
        </div>

        <div className="detail-layout">
          <div className="detail-content">
            <div className="detail-title">
              <div>
                <p className="eyebrow">{room.type} · Hotel Boutique Real</p>
                <h2>{room.name}</h2>
              </div>
              <span className="room-tag detail-tag">{room.tag}</span>
            </div>
            <p className="detail-description">{room.description}</p>
            <div className="room-story">
              <p className="eyebrow">Una forma distinta de descansar</p>
              <h3>Elige cómo quieres despertar</h3>
              <p>
                Esta habitación fue creada con materiales de la región, luz natural y la calma del paisaje como
                protagonista.
              </p>
            </div>

            <div className="detail-facts">
              <div>
                <span className="fact-icon"><Icon name="users" size={22} /></span>
                <span><small>Capacidad</small><strong>Hasta {room.guests} personas</strong></span>
              </div>
              <div>
                <span className="fact-icon"><Icon name="bed" size={23} /></span>
                <span><small>Descanso</small><strong>{room.beds}</strong></span>
              </div>
              <div>
                <span className="fact-icon"><Icon name="calendar" size={21} /></span>
                <span><small>Estancia elegida</small><strong>{nights} {nights === 1 ? "noche" : "noches"}</strong></span>
              </div>
            </div>

            <section className="detail-section">
              <h3>Todo lo que incluye tu estancia</h3>
              <div className="amenity-grid">
                {[...room.features, "Wi-Fi de alta velocidad", "Amenidades de baño", "Limpieza diaria"].map(
                  (feature) => (
                    <div key={feature}>
                      <span><Icon name="check" size={15} /></span>
                      {feature}
                    </div>
                  ),
                )}
              </div>
            </section>

            <section className="detail-section payment-options">
              <div>
                <h3>Opciones de pago</h3>
                <p>Elige tu método en el siguiente paso. Tu información viaja cifrada y protegida.</p>
              </div>
              <div className="payment-methods">
                <div><Icon name="shield" size={20} /><span><strong>Tarjeta de débito</strong><small>Visa y Mastercard</small></span></div>
                <div><Icon name="shield" size={20} /><span><strong>Tarjeta de crédito</strong><small>Visa, Mastercard y American Express</small></span></div>
              </div>
            </section>
          </div>

          <aside className="detail-booking">
            <div className="detail-price">
              <strong>${room.price.toLocaleString("es-MX")}</strong>
              <span>MXN por noche</span>
            </div>
            <div className="detail-dates">
              <div><small>Llegada</small><strong>{stayDateLabel(dates.checkIn)}</strong></div>
              <Icon name="arrow" size={17} />
              <div><small>Salida</small><strong>{stayDateLabel(dates.checkOut)}</strong></div>
            </div>
            <dl>
              <div><dt>${room.price.toLocaleString("es-MX")} × {nights} {nights === 1 ? "noche" : "noches"}</dt><dd>${total.toLocaleString("es-MX")}</dd></div>
              <div><dt>Impuestos y servicio</dt><dd>$620</dd></div>
              <div className="detail-total"><dt>Total estimado</dt><dd>${(total + 620).toLocaleString("es-MX")} MXN</dd></div>
            </dl>
            <Button onClick={onReserve}>
              Reservar esta habitación <Icon name="arrow" />
            </Button>
            <p className="reserve-note"><Icon name="check" size={15} /> Aún no se realizará ningún cargo</p>
            <div className="cancel-policy">
              <Icon name="calendar" size={19} />
              <span><strong>Cancelación flexible</strong><small>Sin costo hasta 24 horas antes.</small></span>
            </div>
          </aside>
        </div>
      </div>
      {zoomIndex !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galería ampliada">
          <button className="lightbox-close" onClick={() => setZoomIndex(null)} aria-label="Cerrar fotografía ampliada">
            <Icon name="close" size={24} />
          </button>
          <div className="lightbox-count">{zoomIndex + 1} / {gallery.length}</div>
          <button
            className="lightbox-arrow previous"
            onClick={() => setZoomIndex((zoomIndex - 1 + gallery.length) % gallery.length)}
            aria-label="Fotografía anterior"
          >
            <Icon name="chevron" size={27} />
          </button>
          <figure>
            <img src={gallery[zoomIndex]} alt={`Vista ampliada ${zoomIndex + 1} de ${room.name}`} />
            <figcaption>{room.name} · Fotografía {zoomIndex + 1}</figcaption>
          </figure>
          <button
            className="lightbox-arrow next"
            onClick={() => setZoomIndex((zoomIndex + 1) % gallery.length)}
            aria-label="Fotografía siguiente"
          >
            <Icon name="chevron" size={27} />
          </button>
          <div className="lightbox-thumbs">
            {gallery.map((image, index) => (
              <button
                className={index === zoomIndex ? "active" : ""}
                onClick={() => setZoomIndex(index)}
                key={image}
                aria-label={`Ver fotografía ${index + 1}`}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
