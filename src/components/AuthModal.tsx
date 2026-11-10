import { useState } from "react";
// import type { FormEvent } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { api } from "../services/api";

export default function AuthModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (user: import("../types").User) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const data = {
        ...Object.fromEntries(form.entries()),
        ...(mode === "register" ? { role: "cliente" } : {}),
      };
      // const result = await api.auth(mode, Object.fromEntries(form.entries()));
      const result = await api.auth(mode, data);

      onSuccess(result.user);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de autenticación");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="auth-art">
        <p className="eyebrow light">Bienvenida a Hotel Boutique Real</p>
        <h2>Tu descanso, siempre a la mano.</h2>
      </div>
      <div className="auth-content">
        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Iniciar sesión
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Crear cuenta
          </button>
        </div>
        <h3>
          {mode === "login"
            ? "Qué gusto verte de nuevo"
            : "Crea tu cuenta en un minuto"}
        </h3>
        <p>
          Guarda tus datos, consulta reservas y gestiona cambios fácilmente.
        </p>
        <form onSubmit={submit}>
          {error && <p role="alert">{error}</p>}
          {mode === "register" && (
            <label>
              Nombre completo
              <input name="name" required placeholder="Nombre completo" />
            </label>
          )}
          <label>
            Correo electrónico
            <input
              name="email"
              required
              type="email"
              placeholder="tu@correo.com"
            />
          </label>
          {mode === "register" && (
            <label>
              Teléfono
              <input
                name="phone"
                required
                type="tel"
                placeholder="+52 55 0000 0000"
              />
            </label>
          )}
          <label>
            Contraseña
            <input
              name="password"
              required
              type="password"
              placeholder="Mínimo 8 caracteres"
              minLength={8}
            />
          </label>
          <Button type="submit" disabled={busy}>
            {mode === "login" ? "Entrar a mi cuenta" : "Crear mi cuenta"}
          </Button>
        </form>
        <p className="privacy">
          Tus datos están protegidos y nunca serán compartidos.
        </p>
      </div>
    </Modal>
  );
}
