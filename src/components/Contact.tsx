import { useState } from "react";
import Icon from "./Icon";
import Button from "./Button";
import { api } from "../services/api";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  return (
    <section className="contact-section" id="contacto">
      <div className="contact-inner section">
        <div className="contact-copy">
          <p className="eyebrow light">Estamos para ayudarte</p>
          <h2>Hablemos de tu próxima estancia</h2>
          <p>
            Si tienes alguna petición especial o necesitas ayuda con tu
            reservación, nuestro equipo en Mazunte responderá personalmente.
          </p>
          <div className="contact-methods">
            <div>
              <span>
                <Icon name="phone" size={21} />
              </span>
              <div>
                <small>Teléfono y WhatsApp</small>
                <strong>+52 958 110 2840</strong>
              </div>
            </div>
            <div>
              <span>
                <Icon name="mail" size={21} />
              </span>
              <div>
                <small>Correo electrónico</small>
                <strong>hola@hotelboutiquereal.mx</strong>
              </div>
            </div>
            <div>
              <span>
                <Icon name="map" size={21} />
              </span>
              <div>
                <small>Visítanos</small>
                <strong>Camino a Punta Cometa, Mazunte, Oaxaca</strong>
              </div>
            </div>
          </div>
          <p className="contact-hours">
            Atención todos los días · 8:00 a 22:00 h
          </p>
        </div>
        <div className="contact-form-card">
          {sent ? (
            <div className="contact-success">
              <span>
                <Icon name="check" size={29} />
              </span>
              <h3>Recibimos tu mensaje</h3>
              <p>Te responderemos en un plazo máximo de 24 horas.</p>
              <Button variant="secondary" onClick={() => setSent(false)}>
                Enviar otro mensaje
              </Button>
            </div>
          ) : (
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                try {
                  await api.contact(Object.fromEntries(data.entries()));
                  setSent(true);
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Error");
                }
              }}
            >
              <div>
                <p className="eyebrow">Contacto directo</p>
                <h3>¿Cómo podemos ayudarte?</h3>
              </div>
              {error && <p role="alert">{error}</p>}
              <div className="contact-form-grid">
                <label>
                  Nombre
                  <input name="name" required placeholder="Tu nombre" />
                </label>
                <label>
                  Correo electrónico
                  <input
                    name="email"
                    required
                    type="email"
                    placeholder="tu@correo.com"
                  />
                </label>
              </div>
              <label>
                Motivo de contacto
                <select name="subject" defaultValue="Reservación">
                  <option>Reservación</option>
                  <option>Petición especial</option>
                  <option>Cambio o cancelación</option>
                  <option>Información general</option>
                </select>
              </label>
              <label>
                Mensaje
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                />
              </label>
              <Button type="submit">
                Enviar mensaje <Icon name="arrow" />
              </Button>
              <small className="form-response-time">
                <Icon name="check" size={14} /> Respondemos normalmente en menos
                de 24 horas.
              </small>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
