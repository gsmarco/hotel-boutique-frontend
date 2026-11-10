export type View = "home" | "bookings" | "admin";
export type IconName = "arrow" | "bed" | "calendar" | "check" | "chevron" | "close" | "mail" | "map" | "menu" | "minus" | "logout" | "phone" | "plus" | "shield" | "sparkle" | "user" | "users";
export type StayDates = {checkIn:string;checkOut:string};
export type Room = {id:number;name:string;type:string;guests:number;beds:string;price:number;image:string;tag:string;description:string;features:string[]};
export type BookingItem = {id:string;roomName:string;roomType:string;image:string;total:number;checkIn:string;checkOut:string;paymentMethod:string;status:"Confirmada"|"Cancelada"|"Pendiente"};
export type User = {id:number;name:string;email:string;phone:string|null;role:"cliente"|"admin"};
