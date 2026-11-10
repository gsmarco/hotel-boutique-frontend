import {useEffect,useRef,useState} from "react";
import type {View,User} from "../types";
import Icon from "./Icon";
import Button from "./Button";

export default function Header({
  view,
  onNavigate,
  loggedIn,
  onAuth,
  bookingCount,
  onLogout,
  user,
}: {
  user: User | null;
  view: View;
  onNavigate: (view: View) => void;
  loggedIn: boolean;
  onAuth: () => void;
  bookingCount: number;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accountOpen) return;

    const closeAccountMenu = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };

    document.addEventListener("mousedown", closeAccountMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeAccountMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [accountOpen]);

  const navigate = (nextView: View) => {
    setOpen(false);
    setAccountOpen(false);
    onNavigate(nextView);
  };

  return (
    <header className="site-header">
      <button className="brand" onClick={() => navigate("home")} aria-label="Ir al inicio">
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
        <button className={view === "home" ? "active" : ""} onClick={() => navigate("home")}>
          Habitaciones
        </button>
        {loggedIn && (
          <button className={view === "bookings" ? "active" : ""} onClick={() => navigate("bookings")}>
            Mis reservaciones
          </button>
        )}
        <button className={view === "admin" ? "active" : ""} onClick={() => navigate("admin")}>
          Administración
        </button>
        <button
          onClick={() => {
            navigate("home");
            window.setTimeout(() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" }), 0);
          }}
        >
          Contacto
        </button>
      </nav>
      <div className="account-menu" ref={accountRef}>
        <Button
          variant="secondary"
          className={accountOpen ? "login-button active" : "login-button"}
          onClick={() => loggedIn ? setAccountOpen((current) => !current) : onAuth()}
          aria-expanded={loggedIn ? accountOpen : undefined}
          aria-haspopup={loggedIn ? "menu" : undefined}
        >
          <Icon name="user" size={18} />
          {loggedIn ? `Hola, ${user?.name.split(" ")[0] ?? ""}` : "Iniciar sesión"}
          {loggedIn && <span className="account-chevron"><Icon name="chevron" size={14} /></span>}
        </Button>
        {loggedIn && accountOpen && (
          <div className="account-popover" role="menu">
            <div className="account-summary">
              <span className="account-avatar">{user?.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</span>
              <div>
                <strong>{user?.name}</strong>
                <small>{user?.email}</small>
              </div>
            </div>
            <button className="account-option" role="menuitem" onClick={() => navigate("bookings")}>
              <span className="account-option-icon"><Icon name="calendar" size={18} /></span>
              <span>
                <strong>Mis reservaciones</strong>
                <small>Consulta próximas estancias e historial</small>
              </span>
              <span className="booking-count">{bookingCount}</span>
            </button>
            <button
              className="account-option logout-option"
              role="menuitem"
              onClick={() => {
                setAccountOpen(false);
                onLogout();
              }}
            >
              <span className="account-option-icon"><Icon name="logout" size={18} /></span>
              <span>
                <strong>Cerrar sesión</strong>
                <small>Salir de tu cuenta de forma segura</small>
              </span>
            </button>
          </div>
        )}
      </div>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Abrir menú">
        <Icon name={open ? "close" : "menu"} />
      </button>
    </header>
  );
}
