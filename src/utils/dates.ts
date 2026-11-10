import type {StayDates,BookingItem} from "../types";
export const dateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const addDays = (value: string, days: number) => {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return dateInputValue(date);
};

export const getInitialStayDates = (): StayDates => {
  const arrival = new Date();
  arrival.setDate(arrival.getDate() + 30);
  const checkIn = dateInputValue(arrival);
  return { checkIn, checkOut: addDays(checkIn, 3) };
};

export const stayNights = (dates: StayDates) =>
  Math.max(1, Math.round((Date.parse(dates.checkOut) - Date.parse(dates.checkIn)) / (24 * 60 * 60 * 1000)));

export const stayDateLabel = (value: string, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("es-MX", options ?? { day: "numeric", month: "short", year: "numeric" })
    .format(new Date(`${value}T12:00:00`))
    .replace(".", "");


export const bookingDate = (value: string) =>
  new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" })
    .format(new Date(value))
    .replace(".", "")
    .toUpperCase();

export const bookingTime = (value: string) =>
  new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(value));

export const canCancelBooking = (booking: BookingItem) =>
  booking.status === "Confirmada" && Date.now() <= new Date(booking.checkIn).getTime() - 24 * 60 * 60 * 1000;


