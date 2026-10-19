import { FormEvent, ReactNode, useMemo, useState } from "react";

type View = "home" | "bookings" | "admin";
type IconName =
  | "arrow"
  | "bed"
  | "calendar"
  | "check"
  | "chevron"
  | "close"
  | "mail"
  | "map"
  | "menu"
  | "minus"
  | "phone"
  | "plus"
  | "shield"
  | "sparkle"
  | "user"
  | "users";

const photos = {
  hero: "https://images.unsplash.com/photo-1790276319819-124404931132?auto=format&fit=crop&w=2000&q=88",
  suite: "https://images.unsplash.com/photo-1774423864869-702b21c2490a?auto=format&fit=crop&w=1200&q=85",
  doble: "https://images.unsplash.com/photo-1765421617367-4b6f88423be9?auto=format&fit=crop&w=1200&q=85",
  sencilla: "https://images.unsplash.com/photo-1743805024402-ca2e66e993c7?auto=format&fit=crop&w=1200&q=85",
};

const roomGroups = [
  {
    type: "Suite",
    names: ["Mar Abierto", "Punta Cometa", "Luz del Pacífico", "Horizonte"],
    guests: 2,
    beds: "1 cama king",
    price: 4380,
    image: photos.suite,
    description:
      "Una suite amplia frente al Pacífico, con terraza privada, hamaca y baño de piedra natural.",
    features: ["Vista directa al mar", "Desayuno incluido", "Terraza privada"],
  },
  {
    type: "Doble",
    names: ["Mangle", "Palma Real", "Ceiba", "Cacao"],
    guests: 4,
    beds: "2 camas queen",
    price: 3250,
    image: photos.doble,
    description:
      "Diseñada para compartir, rodeada de vegetación y con una atmósfera fresca y tranquila.",
    features: ["Vista al jardín", "Desayuno incluido", "Aire acondicionado"],
  },
  {
    type: "Sencilla",
    names: ["Nido Arena", "Caracola", "Salina", "Estrella"],
    guests: 2,
    beds: "1 cama queen",
    price: 2480,
    image: photos.sencilla,
    description:
      "Un refugio íntimo de materiales locales, a pocos pasos de la playa y de nuestra alberca.",
    features: ["Cerca de la playa", "Desayuno incluido", "Balcón"],
  },
];

const roomTags = ["Última disponible", "Más elegida", "Vista especial", "Muy solicitada", "Desayuno incluido", "Mejor ubicación", "Disponible"];

const rooms = roomGroups.flatMap((group, groupIndex) =>
  group.names.map((name, roomIndex) => ({
    id: groupIndex * 4 + roomIndex + 1,
    name: group.type === "Sencilla" && roomIndex === 0 ? name : `${group.type} ${name}`,
    type: group.type,
    guests: group.guests,
    beds: group.beds,
    price: group.price + roomIndex * 120,
    image: group.image,
    tag: roomTags[roomIndex],
    description: group.description,
    features: group.features,
  })),
);

type BookingItem = {
  id: string;
  roomName: string;
  image: string;
  total: number;
  status: "Confirmada" | "Cancelada";
};

const initialBookings: BookingItem[] = [
  {
    id: "MA-082621",
    roomName: "Suite Mar Abierto",
    image: photos.suite,
    total: 13760,
    status: "Confirmada",
  },
];

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    bed: (
      <>
        <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 15h18" />
        <path d="M7 10V7h4a2 2 0 0 1 2 2v1" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="M18 6 6 18M6 6l12 12" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    map: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    minus: <path d="M5 12h14" />,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    sparkle: <path d="m12 3-1.5 4.5L6 9l4.5 1.5L12 15l1.5-4.5L18 9l-4.5-1.5L12 3ZM5 17l-.7 2.3L2 20l2.3.7L5 23l.7-2.3L8 20l-2.3-.7L5 17Z" />,
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4.6" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

function SearchBox({ onSearch }: { onSearch: () => void }) {
  const [guests, setGuests] = useState(2);
  return (
    <div className="search-shell">
      <div className="field">
        <label htmlFor="checkin">Llegada</label>
        <div className="field-control">
          <Icon name="calendar" />
          <input id="checkin" type="date" defaultValue="2026-08-18" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="checkout">Salida</label>
        <div className="field-control">
          <Icon name="calendar" />
          <input id="checkout" type="date" defaultValue="2026-08-21" />
        </div>
      </div>
      <div className="field guest-field">
        <label>Huéspedes</label>
        <div className="counter">
          <button aria-label="Quitar huésped" onClick={() => setGuests(Math.max(1, guests - 1))}>
            <Icon name="minus" size={17} />
          </button>
          <span>
            {guests} {guests === 1 ? "huésped" : "huéspedes"}
          </span>
          <button aria-label="Agregar huésped" onClick={() => setGuests(Math.min(6, guests + 1))}>
            <Icon name="plus" size={17} />
          </button>
        </div>
      </div>
      <Button onClick={onSearch} className="search-button">
        Buscar estancia <Icon name="arrow" />
      </Button>
    </div>
  );
}

function Header({
  view,
  onNavigate,
  loggedIn,
  onAuth,
}: {
  view: View;
  onNavigate: (view: View) => void;
  loggedIn: boolean;
  onAuth: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <button className="brand" onClick={() => onNavigate("home")} aria-label="Ir al inicio">
        <span className="brand-mark">
          <span />
          <span />
        </span>
        <span>
          <strong>HOTEL BOUTIQUE REAL</strong>
          <small>MAZUNTE · OAXACA</small>
        </span>
      </button>
      <nav className={open ? "nav open" : "nav"}>
        <button className={view === "home" ? "active" : ""} onClick={() => onNavigate("home")}>
          Habitaciones
        </button>
        {loggedIn && (
          <button className={view === "bookings" ? "active" : ""} onClick={() => onNavigate("bookings")}>
            Mis reservaciones
          </button>
        )}
        <button className={view === "admin" ? "active" : ""} onClick={() => onNavigate("admin")}>
          Administración
        </button>
        <button
          onClick={() => {
            onNavigate("home");
            window.setTimeout(() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" }), 0);
          }}
        >
          Contacto
        </button>
      </nav>
      <Button variant="secondary" className="login-button" onClick={onAuth}>
        <Icon name="user" size={18} />
        {loggedIn ? "Hola, Mariana" : "Iniciar sesión"}
      </Button>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Abrir menú">
        <Icon name={open ? "close" : "menu"} />
      </button>
    </header>
  );
}

function Home({
  onBook,
}: {
  onBook: (room: (typeof rooms)[number]) => void;
}) {
  const [filter, setFilter] = useState("Todas");
  const shownRooms = filter === "Todas" ? rooms : rooms.filter((room) => room.type === filter);

  return (
    <>
      <section className="hero">
        <img src={photos.hero} alt="Terraza de madera abierta al océano Pacífico" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow light">Tu refugio frente al Pacífico</p>
          <h1>
            Donde el mar
            <br />
            marca el ritmo
          </h1>
          <p className="hero-copy">
            Descansa entre la selva y el océano. Una estancia serena y auténtica en el corazón de Mazunte.
          </p>
        </div>
        <div className="hero-search">
          <SearchBox onSearch={() => document.getElementById("room-results")?.scrollIntoView({ behavior: "smooth" })} />
          <p className="reassurance">
            <Icon name="check" size={16} /> Mejor tarifa garantizada · Sin cargos ocultos
          </p>
        </div>
      </section>

      <main>
        <section className="availability section">
          <div className="availability-heading">
            <p className="eyebrow">Espacios para bajar el ritmo</p>
          </div>
          <div className="promise compact">
            <div>
              <Icon name="shield" size={25} />
              <h3>Reserva con tranquilidad</h3>
              <p>Pago seguro y confirmación inmediata.</p>
            </div>
            <div>
              <Icon name="calendar" size={25} />
              <h3>Planes que sí cambian</h3>
              <p>Cancela sin costo hasta 3 horas antes.</p>
            </div>
            <div>
              <Icon name="sparkle" size={25} />
              <h3>Atención humana</h3>
              <p>Estamos aquí antes, durante y después.</p>
            </div>
          </div>
        </section>

        <section className="rooms section" id="room-results">
          <div className="filter-row" aria-label="Filtrar habitaciones">
            {["Todas", "Sencilla", "Doble", "Suite"].map((item) => (
              <button className={filter === item ? "filter active" : "filter"} onClick={() => setFilter(item)} key={item}>
                {item}
              </button>
            ))}
            <span>{shownRooms.length} habitaciones disponibles</span>
          </div>
          <div className="room-grid">
            {shownRooms.map((room) => (
              <article className="room-card" key={room.id}>
                <div className="room-image">
                  <img src={room.image} alt={`Interior de ${room.name}`} />
                  <span className="room-tag">{room.tag}</span>
                </div>
                <div className="room-body">
                  <div className="room-heading">
                    <div>
                      <p>{room.type}</p>
                      <h3>{room.name}</h3>
                    </div>
                    <div className="price">
                      <strong>${room.price.toLocaleString("es-MX")}</strong>
                      <span>MXN / noche</span>
                    </div>
                  </div>
                  <div className="room-meta">
                    <span>
                      <Icon name="users" size={17} /> Hasta {room.guests}
                    </span>
                    <span>
                      <Icon name="bed" size={18} /> {room.beds}
                    </span>
                  </div>
                  <p className="room-description">{room.description}</p>
                  <ul>
                    {room.features.map((feature) => (
                      <li key={feature}>
                        <Icon name="check" size={15} /> {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="secondary" onClick={() => onBook(room)}>
                    Ver habitación <Icon name="arrow" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

function Modal({
  children,
  onClose,
  wide = false,
  full = false,
}: {
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
  full?: boolean;
}) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className={`modal${wide ? " wide" : ""}${full ? " full" : ""}`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="modal-close" aria-label="Cerrar" onClick={onClose}>
          <Icon name="close" />
        </button>
        {children}
      </div>
    </div>
  );
}

function AuthModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSuccess();
  };
  return (
    <Modal onClose={onClose}>
      <div className="auth-art">
        <p className="eyebrow light">Bienvenida a Hotel Boutique Real</p>
        <h2>Tu descanso, siempre a la mano.</h2>
      </div>
      <div className="auth-content">
        <div className="auth-tabs">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            Iniciar sesión
          </button>
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
            Crear cuenta
          </button>
        </div>
        <h3>{mode === "login" ? "Qué gusto verte de nuevo" : "Crea tu cuenta en un minuto"}</h3>
        <p>Guarda tus datos, consulta reservas y gestiona cambios fácilmente.</p>
        <form onSubmit={submit}>
          {mode === "register" && (
            <label>
              Nombre completo
              <input required placeholder="Mariana Torres" />
            </label>
          )}
          <label>
            Correo electrónico
            <input required type="email" placeholder="tu@correo.com" />
          </label>
          {mode === "register" && (
            <label>
              Teléfono
              <input required type="tel" placeholder="+52 55 0000 0000" />
            </label>
          )}
          <label>
            Contraseña
            <input required type="password" placeholder="Mínimo 8 caracteres" minLength={8} />
          </label>
          <Button type="submit">{mode === "login" ? "Entrar a mi cuenta" : "Crear mi cuenta"}</Button>
        </form>
        <p className="privacy">Tus datos están protegidos y nunca serán compartidos.</p>
      </div>
    </Modal>
  );
}

function RoomDetailModal({
  room,
  onClose,
  onReserve,
}: {
  room: (typeof rooms)[number];
  onClose: () => void;
  onReserve: () => void;
}) {
  const gallery = [room.image, photos.hero, room.type === "Suite" ? photos.doble : photos.suite];
  const total = room.price * 3;
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
                <span><small>Estancia elegida</small><strong>3 noches</strong></span>
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
              <div><small>Llegada</small><strong>18 ago, 2026</strong></div>
              <Icon name="arrow" size={17} />
              <div><small>Salida</small><strong>21 ago, 2026</strong></div>
            </div>
            <dl>
              <div><dt>${room.price.toLocaleString("es-MX")} × 3 noches</dt><dd>${total.toLocaleString("es-MX")}</dd></div>
              <div><dt>Impuestos y servicio</dt><dd>$620</dd></div>
              <div className="detail-total"><dt>Total estimado</dt><dd>${(total + 620).toLocaleString("es-MX")} MXN</dd></div>
            </dl>
            <Button onClick={onReserve}>
              Reservar esta habitación <Icon name="arrow" />
            </Button>
            <p className="reserve-note"><Icon name="check" size={15} /> Aún no se realizará ningún cargo</p>
            <div className="cancel-policy">
              <Icon name="calendar" size={19} />
              <span><strong>Cancelación flexible</strong><small>Sin costo hasta 3 horas antes.</small></span>
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

function CheckoutModal({
  room,
  onClose,
  onComplete,
}: {
  room: (typeof rooms)[number];
  onClose: () => void;
  onComplete: (confirmationId: string) => void;
}) {
  const [step, setStep] = useState(2);
  const [confirmationId] = useState(() => `MA-${String(Date.now()).slice(-6)}`);
  const total = room.price * 3 + 620;
  return (
    <Modal onClose={onClose} wide>
      <div className="checkout-head">
        <div>
          <p className="eyebrow">Reserva segura</p>
          <h2>{step === 3 ? "Todo listo para Mazunte" : "Completa tu reservación"}</h2>
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
                  <Icon name="check" /> Puedes cancelar sin costo hasta 3 horas antes de tu llegada.
                </div>
                <Button onClick={() => setStep(2)}>
                  Continuar al pago <Icon name="arrow" />
                </Button>
              </>
            ) : (
              <>
                <h3>Pago</h3>
                <p>Tu tarjeta será procesada de forma segura y encriptada.</p>
                <label>
                  Nombre en la tarjeta
                  <input defaultValue="Mariana Torres" />
                </label>
                <label>
                  Número de tarjeta
                  <input inputMode="numeric" placeholder="1234 5678 9012 3456" />
                </label>
                <div className="form-grid">
                  <label>
                    Vencimiento
                    <input placeholder="MM / AA" />
                  </label>
                  <label>
                    CVV
                    <input placeholder="123" />
                  </label>
                </div>
                <Button onClick={() => setStep(3)}>
                  Pagar ${total.toLocaleString("es-MX")} MXN <Icon name="shield" size={18} />
                </Button>
                <p className="saved-profile-note">
                  <Icon name="check" size={15} /> Usaremos los datos guardados en tu cuenta para esta reservación.
                </p>
              </>
            )}
          </div>
          <aside className="summary">
            <img src={room.image} alt={room.name} />
            <div>
              <small>{room.type}</small>
              <h3>{room.name}</h3>
              <p>18–21 agosto · 3 noches · 2 huéspedes</p>
            </div>
            <dl>
              <div>
                <dt>${room.price.toLocaleString("es-MX")} × 3 noches</dt>
                <dd>${(room.price * 3).toLocaleString("es-MX")}</dd>
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
              <Icon name="shield" size={18} /> Pago protegido y confirmación inmediata
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
          <span>Te enviamos todos los detalles a mariana@correo.com</span>
          <div className="success-card">
            <img src={room.image} alt="" />
            <div>
              <strong>{room.name}</strong>
              <span>18–21 agosto · 3 noches</span>
            </div>
          </div>
          <Button onClick={() => onComplete(confirmationId)}>Ver mis reservaciones</Button>
        </div>
      )}
    </Modal>
  );
}

function Bookings({
  onExplore,
  bookings,
  onCancel,
}: {
  onExplore: () => void;
  bookings: BookingItem[];
  onCancel: (id: string) => void;
}) {
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
  const upcoming = bookings.filter((booking) => booking.status === "Confirmada");
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
        <button className={tab === "upcoming" ? "active" : ""} onClick={() => setTab("upcoming")}>
          Próximas <span>{upcoming.length}</span>
        </button>
        <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>
          Historial {history.length > 0 && <span>{history.length}</span>}
        </button>
      </div>
      {visibleBookings.length > 0 ? (
        <div className="booking-list">
          {visibleBookings.map((booking) => (
            <article className={booking.status === "Cancelada" ? "booking-card cancelled" : "booking-card"} key={booking.id}>
              <img src={booking.image} alt={booking.roomName} />
              <div className="booking-info">
                <div className="status">{booking.status}</div>
                <p>Confirmación #{booking.id}</p>
                <h2>{booking.roomName}</h2>
                <div className="booking-dates">
                  <div><small>Llegada</small><strong>18 AGO, 2026</strong><span>15:00 h</span></div>
                  <Icon name="arrow" />
                  <div><small>Salida</small><strong>21 AGO, 2026</strong><span>12:00 h</span></div>
                </div>
              </div>
              <div className="booking-actions">
                <strong>${booking.total.toLocaleString("es-MX")} MXN</strong>
                <span>{booking.status === "Cancelada" ? "Reembolso procesado" : "Pagado"}</span>
                {booking.status === "Confirmada" && (
                  <>
                    <Button variant="secondary">Ver detalles</Button>
                    <button className="cancel-link" onClick={() => onCancel(booking.id)}>Cancelar reservación</button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-bookings">
          <Icon name="calendar" size={28} />
          <h2>{tab === "upcoming" ? "Aún no tienes próximas estancias" : "No hay reservaciones en tu historial"}</h2>
          <p>Cuando realices o canceles una reservación, aparecerá aquí.</p>
          {tab === "upcoming" && <Button onClick={onExplore}>Explorar habitaciones</Button>}
        </div>
      )}
      {upcoming.length > 0 && tab === "upcoming" && (
        <div className="policy-card">
          <Icon name="calendar" />
          <div>
            <strong>Cancelación flexible</strong>
            <p>Puedes cancelar tus reservaciones sin costo hasta el 18 de agosto a las 12:00 h.</p>
          </div>
        </div>
      )}
    </main>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section className="contact-section" id="contacto">
      <div className="contact-inner section">
        <div className="contact-copy">
          <p className="eyebrow light">Estamos para ayudarte</p>
          <h2>Hablemos de tu próxima estancia</h2>
          <p>
            Si tienes alguna petición especial o necesitas ayuda con tu reservación, nuestro equipo en Mazunte
            responderá personalmente.
          </p>
          <div className="contact-methods">
            <div>
              <span><Icon name="phone" size={21} /></span>
              <div><small>Teléfono y WhatsApp</small><strong>+52 958 110 2840</strong></div>
            </div>
            <div>
              <span><Icon name="mail" size={21} /></span>
              <div><small>Correo electrónico</small><strong>hola@hotelboutiquereal.mx</strong></div>
            </div>
            <div>
              <span><Icon name="map" size={21} /></span>
              <div><small>Visítanos</small><strong>Camino a Punta Cometa, Mazunte, Oaxaca</strong></div>
            </div>
          </div>
          <p className="contact-hours">Atención todos los días · 8:00 a 22:00 h</p>
        </div>
        <div className="contact-form-card">
          {sent ? (
            <div className="contact-success">
              <span><Icon name="check" size={29} /></span>
              <h3>Recibimos tu mensaje</h3>
              <p>Te responderemos en un plazo máximo de 24 horas.</p>
              <Button variant="secondary" onClick={() => setSent(false)}>Enviar otro mensaje</Button>
            </div>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
              <div>
                <p className="eyebrow">Contacto directo</p>
                <h3>¿Cómo podemos ayudarte?</h3>
              </div>
              <div className="contact-form-grid">
                <label>
                  Nombre
                  <input required placeholder="Tu nombre" />
                </label>
                <label>
                  Correo electrónico
                  <input required type="email" placeholder="tu@correo.com" />
                </label>
              </div>
              <label>
                Motivo de contacto
                <select defaultValue="Reservación">
                  <option>Reservación</option>
                  <option>Petición especial</option>
                  <option>Cambio o cancelación</option>
                  <option>Información general</option>
                </select>
              </label>
              <label>
                Mensaje
                <textarea required rows={4} placeholder="Cuéntanos cómo podemos ayudarte..." />
              </label>
              <Button type="submit">Enviar mensaje <Icon name="arrow" /></Button>
              <small className="form-response-time">
                <Icon name="check" size={14} /> Respondemos normalmente en menos de 24 horas.
              </small>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Admin() {
  const [showForm, setShowForm] = useState(false);
  const [reservations, setReservations] = useState([
    { id: "MA-082621", guest: "Mariana Torres", room: "Suite Mar Abierto", dates: "18–21 Ago", status: "Confirmada", total: "$13,760" },
    { id: "MA-082618", guest: "Diego Ramos", room: "Doble Mangle", dates: "19–22 Ago", status: "Pendiente", total: "$10,370" },
    { id: "MA-082605", guest: "Ana Navarro", room: "Nido Arena", dates: "21–23 Ago", status: "Confirmada", total: "$5,580" },
  ]);
  const cancel = (id: string) =>
    setReservations((current) => current.map((item) => (item.id === id ? { ...item, status: "Cancelada" } : item)));
  return (
    <main className="admin-page section">
      <div className="admin-top">
        <div>
          <p className="eyebrow">Panel operativo</p>
          <h1>Buenos días, Andrés</h1>
          <p>Aquí tienes el estado del hotel para hoy.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Icon name="plus" /> Dar de alta habitación
        </Button>
      </div>
      {showForm && (
        <form className="new-room" onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}>
          <h3>Nueva habitación</h3>
          <input required placeholder="Nombre de habitación" />
          <select defaultValue="Sencilla"><option>Sencilla</option><option>Doble</option><option>Suite</option></select>
          <input required type="number" placeholder="Precio por noche" />
          <Button type="submit">Guardar habitación</Button>
        </form>
      )}
      <div className="metrics">
        <div><span>Ocupación hoy</span><strong>82%</strong><small>18 de 22 habitaciones</small></div>
        <div><span>Llegadas</span><strong>7</strong><small>3 ya registradas</small></div>
        <div><span>Salidas</span><strong>5</strong><small>Antes de las 12:00 h</small></div>
        <div><span>Ingresos del mes</span><strong>$286k</strong><small className="positive">+12.4% vs. julio</small></div>
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
                  <td>{reservation.guest}</td><td>{reservation.room}</td><td>{reservation.dates}</td>
                  <td><span className={`status-pill ${reservation.status.toLowerCase()}`}>{reservation.status}</span></td>
                  <td>{reservation.total}</td>
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
          {[["Sencillas", 5, 7], ["Dobles", 7, 9], ["Suites", 6, 6]].map(([label, available, total]) => (
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

function Footer() {
  return (
    <footer>
      <div className="brand footer-brand">
        <span className="brand-mark"><span /><span /></span>
        <span><strong>HOTEL BOUTIQUE REAL</strong><small>MAZUNTE · OAXACA</small></span>
      </div>
      <p>Hospitalidad consciente frente al Pacífico mexicano.</p>
      <div><span>Privacidad</span><span>Términos</span><span>Contacto</span></div>
    </footer>
  );
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [loggedIn, setLoggedIn] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [detailRoom, setDetailRoom] = useState<(typeof rooms)[number] | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<(typeof rooms)[number] | null>(null);
  const [pendingRoom, setPendingRoom] = useState<(typeof rooms)[number] | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);

  const content = useMemo(() => {
    if (view === "admin") return <Admin />;
    if (view === "bookings" && loggedIn) {
      return (
        <Bookings
          onExplore={() => setView("home")}
          bookings={bookings}
          onCancel={(id) =>
            setBookings((current) =>
              current.map((booking) => booking.id === id ? { ...booking, status: "Cancelada" } : booking),
            )
          }
        />
      );
    }
    return (
      <Home
        onBook={(room) => setDetailRoom(room)}
      />
    );
  }, [view, loggedIn, bookings]);

  const completeAuth = () => {
    setLoggedIn(true);
    setAuthOpen(false);
    if (pendingRoom) {
      setSelectedRoom(pendingRoom);
      setPendingRoom(null);
    }
  };

  return (
    <div className="app">
      <Header view={view} onNavigate={setView} loggedIn={loggedIn} onAuth={() => setAuthOpen(true)} />
      {content}
      {view === "home" && <Contact />}
      {view !== "admin" && <Footer />}
      {detailRoom && (
        <RoomDetailModal
          room={detailRoom}
          onClose={() => setDetailRoom(null)}
          onReserve={() => {
            const room = detailRoom;
            setDetailRoom(null);
            if (loggedIn) setSelectedRoom(room);
            else {
              setPendingRoom(room);
              setAuthOpen(true);
            }
          }}
        />
      )}
      {authOpen && <AuthModal onClose={() => { setAuthOpen(false); setPendingRoom(null); }} onSuccess={completeAuth} />}
      {selectedRoom && (
        <CheckoutModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onComplete={(confirmationId) => {
            setBookings((current) => [
              {
                id: confirmationId,
                roomName: selectedRoom.name,
                image: selectedRoom.image,
                total: selectedRoom.price * 3 + 620,
                status: "Confirmada",
              },
              ...current,
            ]);
            setSelectedRoom(null);
            setView("bookings");
          }}
        />
      )}
    </div>
  );
}
