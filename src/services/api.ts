import type { BookingItem, Room, User } from "../types";
import { generateUUID } from "../utils/generateUUID";

const base = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const TOKEN_KEY = "hotel_token";

// Función centralizada para todas las peticiones HTTP
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Leer el token en cada petición
  const token = localStorage.getItem(TOKEN_KEY);

  const headers = new Headers(options.headers);

  // Solo agregar Content-Type cuando enviamos JSON
  if (options.body && !(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  // Agregar JWT automáticamente cuando exista
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(base + path, {
    ...options,
    headers,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      body.error?.message || body.message || `Error HTTP ${res.status}`,
    );
  }

  return body.data as T;
}

export const api = {
  // ===================================
  // AUTENTICACIÓN
  // ===================================

  auth: async (
    mode: "login" | "register",
    data: Record<string, FormDataEntryValue>,
  ) => {
    const result = await request<{
      token: string;
      user: User;
    }>(`/auth/${mode}`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    localStorage.setItem(TOKEN_KEY, result.token);

    return result;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  me: () => request<User>("/auth/me"),

  // ===================================
  // HABITACIONES
  // ===================================

  rooms: () => request<Room[]>("/rooms"),

  createRoom: (data: { name: string; type: string; price: number }) =>
    request<Room>("/rooms", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // ===================================
  // RESERVACIONES
  // ===================================

  bookings: () => request<BookingItem[]>("/bookings"),

  createBooking: (data: {
    roomId: number;
    checkIn: string;
    checkOut: string;
    guests: number;
    paymentMethod: string;
  }) =>
    request<{ id: string }>("/bookings", {
      method: "POST",
      headers: {
        // "Idempotency-Key": crypto.randomUUID(),
        "Idempotency-Key": generateUUID(),
      },
      body: JSON.stringify(data),
    }),

  cancelBooking: (id: string) =>
    request(`/bookings/${encodeURIComponent(id)}/cancel`, { method: "PATCH" }),

  // ===================================
  // CONTACTO
  // ===================================

  contact: (data: Record<string, FormDataEntryValue>) =>
    request("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // ===================================
  // ADMINISTRACIÓN
  // ===================================

  adminBookings: () =>
    request<(BookingItem & { guest: string })[]>("/admin/bookings"),

  metrics: () =>
    request<{
      occupancy: number;
      occupied: number;
      rooms: number;
      arrivals: number;
      departures: number;
      revenue: number;
    }>("/admin/metrics"),
};

// import type { BookingItem, Room, User } from "../types";
// const base = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
// let token = localStorage.getItem("hotel_token");

// async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };

//   const res = await fetch(base + path, {
//     ...options,
//     headers: { ...headers, ...options.headers },
//   });

//   const body = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(body.error?.message || `HTTP ${res.status}`);
//   return body.data as T;
// }
// export const api = {
//   auth: async (
//     mode: "login" | "register",
//     data: Record<string, FormDataEntryValue>,
//   ) => {
//     const result = await request<{ token: string; user: User }>(
//       `/auth/${mode}`,
//       { method: "POST", body: JSON.stringify(data) },
//     );
//     token = result.token;
//     localStorage.setItem("hotel_token", token);
//     return result;
//   },

//   logout: () => {
//     token = null;
//     localStorage.removeItem("hotel_token");
//   },

//   me: () => request<User>("/auth/me"),
//   rooms: () => request<Room[]>("/rooms"),
//   bookings: () => request<BookingItem[]>("/bookings"),
//   createBooking: (data: {
//     roomId: number;
//     checkIn: string;
//     checkOut: string;
//     guests: number;
//     paymentMethod: string;
//   }) =>
//     request<{ id: string }>("/bookings", {
//       method: "POST",
//       headers: { "Idempotency-Key": crypto.randomUUID() },
//       body: JSON.stringify(data),
//     }),
//   cancelBooking: (id: string) =>
//     request(`/bookings/${encodeURIComponent(id)}/cancel`, { method: "PATCH" }),
//   contact: (data: Record<string, FormDataEntryValue>) =>
//     request("/contact", { method: "POST", body: JSON.stringify(data) }),
//   adminBookings: () =>
//     request<(BookingItem & { guest: string })[]>("/admin/bookings"),
//   metrics: () =>
//     request<{
//       occupancy: number;
//       occupied: number;
//       rooms: number;
//       arrivals: number;
//       departures: number;
//       revenue: number;
//     }>("/admin/metrics"),
//   createRoom: (data: { name: string; type: string; price: number }) =>
//     request<Room>("/rooms", { method: "POST", body: JSON.stringify(data) }),
// };
