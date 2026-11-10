import { useState } from "react";
import type { Room, StayDates } from "../types";
import { stayNights, stayDateLabel } from "../utils/dates";
import Modal from "./Modal";
import Icon from "./Icon";
import Button from "./Button";
import { api } from "../services/api";

export default function CheckoutModal({
  room,
  dates,
  onClose,
  onComplete,
}: {
  room: Room;
  dates: StayDates;
  onClose: () => void;
  onComplete: (confirmationId: string) => void;
}) {
  const [step, setStep] = useState(2);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmationId, setConfirmationId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "transfer" | "cash"
  >("card");
  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [guests, setGuests] = useState(Math.min(2, room.guests || 1));

  const confirmBooking = async () => {
    setError("");
    if (
      !Number.isInteger(guests) ||
      guests < 1 ||
      guests > Math.min(room.guests, 20)
    ) {
      setError(
        `La habitación permite entre 1 y ${Math.min(room.guests, 20)} huéspedes.`,
      );
      return;
    }
    if (!accepted) {
      setError(
        "Debes aceptar que esta operación es únicamente una simulación escolar.",
      );
      return;
    }
    if (paymentMethod === "card") {
      const digits = cardNumber.replace(/\s/g, "");
      const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(expiration);
      const today = new Date();
      const validExpiry =
        match &&
        (2000 + Number(match[2]) > today.getFullYear() ||
          (2000 + Number(match[2]) === today.getFullYear() &&
            Number(match[1]) >= today.getMonth() + 1));
      if (cardholder.trim().length < 2) {
        setError("Escribe un nombre ficticio de al menos 2 caracteres.");
        return;
      }
      if (!/^\d{16}$/.test(digits)) {
        setError("El número ficticio debe contener exactamente 16 dígitos.");
        return;
      }
      if (!validExpiry) {
        setError(
          "Introduce un vencimiento ficticio válido en formato MM/AA, del mes actual en adelante.",
        );
        return;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setError("El CVV ficticio debe contener 3 o 4 dígitos.");
        return;
      }
    }
    setBusy(true);
    try {
      // No enviamos número de tarjeta, vencimiento ni CVV al servidor.
      // server.js admite únicamente este valor de paymentMethod.
      const result = await api.createBooking({
        roomId: room.id,
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        guests,
        paymentMethod: "Simulado (sin cobro)",
      });
      setConfirmationId(result.id);
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo reservar");
    } finally {
      setBusy(false);
    }
  };
  const nights = stayNights(dates);
  const total = room.price * nights + 620;
  return (
    <Modal onClose={onClose} wide>
      <div className="checkout-head">
        <div>
          <p className="eyebrow">Reserva segura</p>
          <h2>
            {step === 3 ? "Todo listo para Mazunte" : "Completa tu reservación"}
          </h2>
        </div>
        <div className="steps" aria-label="Progreso de compra">
          {[1, 2, 3].map((item) => (
            <span className={step >= item ? "active" : ""} key={item}>
              {step > item ? <Icon name="check" size={14} /> : item}
            </span>
          ))}
        </div>
      </div>
      {step < 3 ? (
        <div className="checkout-grid">
          <div className="checkout-form">
            {step === 1 ? (
              <>
                <h3>Datos del huésped</h3>
                <p>Usaremos esta información para enviarte la confirmación.</p>
                <div className="form-grid">
                  <label>
                    Nombre
                    <input defaultValue="Mariana" />
                  </label>
                  <label>
                    Apellidos
                    <input defaultValue="Torres" />
                  </label>
                  <label className="full">
                    Correo electrónico
                    <input type="email" defaultValue="mariana@correo.com" />
                  </label>
                  <label className="full">
                    Teléfono
                    <input type="tel" placeholder="+52 55 0000 0000" />
                  </label>
                </div>
                <div className="info-note">
                  <Icon name="check" /> Puedes cancelar sin costo hasta 3 horas
                  antes de tu llegada.
                </div>
                <Button onClick={() => setStep(2)}>
                  Continuar al pago <Icon name="arrow" />
                </Button>
              </>
            ) : (
              <>
                <h3>Pago de demostración</h3>
                <p>
                  Actividad escolar: no se procesan pagos ni se aceptan datos
                  bancarios reales.
                </p>
                <label>
                  Método de pago
                  <select
                    value={paymentMethod}
                    onChange={(e) => {
                      setPaymentMethod(
                        e.target.value as "card" | "transfer" | "cash",
                      );
                      setError("");
                    }}
                  >
                    <option value="card">Tarjeta ficticia</option>
                    <option value="transfer">Transferencia simulada</option>
                    <option value="cash">Efectivo al llegar (simulado)</option>
                  </select>
                </label>
                <label>
                  Número de huéspedes
                  <input
                    type="number"
                    min={1}
                    max={Math.min(room.guests, 20)}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  />
                </label>
                {paymentMethod === "card" && (
                  <>
                    <p>
                      Introduce únicamente datos inventados: 16 dígitos, CVV de
                      3 o 4 dígitos y vencimiento futuro. No uses datos
                      bancarios reales.
                    </p>
                    <label>
                      Nombre del titular ficticio
                      <input
                        value={cardholder}
                        maxLength={150}
                        autoComplete="off"
                        onChange={(e) => setCardholder(e.target.value)}
                        placeholder="Cliente de prueba"
                      />
                    </label>
                    <label>
                      Número de tarjeta ficticia
                      <input
                        value={cardNumber}
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={19}
                        placeholder="4242 4242 4242 4242"
                        onChange={(e) => {
                          const digits = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 16);
                          setCardNumber(
                            digits.replace(/(\d{4})(?=\d)/g, "$1 "),
                          );
                        }}
                      />
                    </label>
                    <div className="form-grid">
                      <label>
                        Vencimiento ficticio (MM/AA)
                        <input
                          value={expiration}
                          inputMode="numeric"
                          maxLength={5}
                          autoComplete="off"
                          placeholder="12/28"
                          onChange={(e) =>
                            setExpiration(
                              e.target.value.replace(/[^\d/]/g, "").slice(0, 5),
                            )
                          }
                        />
                      </label>
                      <label>
                        CVV ficticio
                        <input
                          value={cvv}
                          type="password"
                          inputMode="numeric"
                          autoComplete="off"
                          maxLength={4}
                          placeholder="123 o 1234"
                          onChange={(e) =>
                            setCvv(
                              e.target.value.replace(/\D/g, "").slice(0, 4),
                            )
                          }
                        />
                      </label>
                    </div>
                  </>
                )}
                {paymentMethod === "transfer" && (
                  <p>
                    Transferencia de demostración. No se requiere cuenta
                    bancaria ni comprobante real.
                  </p>
                )}
                {paymentMethod === "cash" && (
                  <p>
                    Pago ficticio en efectivo al llegar. No se realiza ningún
                    cobro.
                  </p>
                )}
                <label>
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                  />{" "}
                  Acepto que esta operación es una simulación escolar sin cobro
                  real.
                </label>
                {error && <p role="alert">{error}</p>}
                <Button disabled={busy} onClick={confirmBooking}>
                  {busy
                    ? "Registrando..."
                    : `Confirmar reserva de $${total.toLocaleString("es-MX")} MXN`}{" "}
                  <Icon name="shield" size={18} />
                </Button>
                <p className="saved-profile-note">
                  <Icon name="check" size={15} /> Usaremos los datos guardados
                  en tu cuenta para esta reservación.
                </p>
              </>
            )}
          </div>
          <aside className="summary">
            <img src={room.image} alt={room.name} />
            <div>
              <small>{room.type}</small>
              <h3>{room.name}</h3>
              <p>
                {stayDateLabel(dates.checkIn, {
                  day: "numeric",
                  month: "short",
                })}
                –
                {stayDateLabel(dates.checkOut, {
                  day: "numeric",
                  month: "short",
                })}{" "}
                · {nights} {nights === 1 ? "noche" : "noches"} · {guests}{" "}
                huéspedes
              </p>
            </div>
            <dl>
              <div>
                <dt>
                  ${room.price.toLocaleString("es-MX")} × {nights}{" "}
                  {nights === 1 ? "noche" : "noches"}
                </dt>
                <dd>${(room.price * nights).toLocaleString("es-MX")}</dd>
              </div>
              <div>
                <dt>Impuestos y servicio</dt>
                <dd>$620</dd>
              </div>
              <div className="total">
                <dt>Total</dt>
                <dd>${total.toLocaleString("es-MX")} MXN</dd>
              </div>
            </dl>
            <p className="secure-copy">
              <Icon name="shield" size={18} /> Simulación escolar y confirmación
              inmediata
            </p>
          </aside>
        </div>
      ) : (
        <div className="success">
          <span className="success-icon">
            <Icon name="check" size={32} />
          </span>
          <p>Confirmación #{confirmationId}</p>
          <h3>Tu habitación está reservada</h3>
          <span>Tu confirmación está guardada en tu cuenta</span>
          <div className="success-card">
            <img src={room.image} alt="" />
            <div>
              <strong>{room.name}</strong>
              <span>
                {stayDateLabel(dates.checkIn, {
                  day: "numeric",
                  month: "short",
                })}
                –
                {stayDateLabel(dates.checkOut, {
                  day: "numeric",
                  month: "short",
                })}{" "}
                · {nights} {nights === 1 ? "noche" : "noches"}
              </span>
            </div>
          </div>
          <Button onClick={() => onComplete(confirmationId)}>
            Ver mis reservaciones
          </Button>
        </div>
      )}
    </Modal>
  );
}
