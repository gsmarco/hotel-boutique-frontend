import {useEffect,useState} from "react";
import type {Room,BookingItem,StayDates,User,View} from "./types";
import {getInitialStayDates} from "./utils/dates";
import {api} from "./services/api";
import Header from "./components/Header";
import Home from "./components/Home";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import RoomDetailModal from "./components/RoomDetailModal";
import CheckoutModal from "./components/CheckoutModal";
import Bookings from "./components/Bookings";
import Admin from "./components/Admin";

export default function App(){
 const [view,setView]=useState<View>("home");const [user,setUser]=useState<User|null>(null);
 const [authOpen,setAuthOpen]=useState(false);const [detailRoom,setDetailRoom]=useState<Room|null>(null);
 const [selectedRoom,setSelectedRoom]=useState<Room|null>(null);const [pendingRoom,setPendingRoom]=useState<Room|null>(null);
 const [rooms,setRooms]=useState<Room[]>([]);const [bookings,setBookings]=useState<BookingItem[]>([]);
 const [stayDates,setStayDates]=useState<StayDates>(getInitialStayDates);const [error,setError]=useState("");
 const loadRooms=async()=>{try{setRooms(await api.rooms());}catch(e){setError(String(e));}};
 const loadBookings=async()=>{try{setBookings(await api.bookings());}catch(e){setError(String(e));}};
 useEffect(()=>{void loadRooms();void api.me().then(setUser).catch(()=>{});},[]);
 useEffect(()=>{if(user)void loadBookings();else setBookings([]);},[user]);
 const logout=()=>{api.logout();setUser(null);setView("home");setAuthOpen(false);setDetailRoom(null);setSelectedRoom(null);setPendingRoom(null);};
 const navigate=(next:View)=>{if(next==="admin"&&user?.role!=="admin"){setError("Acceso reservado a administradores");return;}if(next==="bookings"&&!user){setAuthOpen(true);return;}setView(next);};
 return <div className="app">
 <Header view={view} onNavigate={navigate} loggedIn={!!user} user={user} onAuth={()=>setAuthOpen(true)} bookingCount={bookings.length} onLogout={logout}/>
 {error&&<p role="alert" style={{padding:16}}>{error}</p>}
 {view==="admin"&&user?.role==="admin"?<Admin onLogout={logout}/>:view==="bookings"&&user?<Bookings onExplore={()=>setView("home")} bookings={bookings} onCancel={async(id)=>{try{await api.cancelBooking(id);await loadBookings();}catch(e){setError(String(e));}}}/>:<Home rooms={rooms} onBook={setDetailRoom} dates={stayDates} onDatesChange={setStayDates}/>}
 {view==="home"&&<Contact/>}{view!=="admin"&&<Footer/>}
 {detailRoom&&<RoomDetailModal room={detailRoom} dates={stayDates} onClose={()=>setDetailRoom(null)} onReserve={()=>{const r=detailRoom;setDetailRoom(null);if(user)setSelectedRoom(r);else{setPendingRoom(r);setAuthOpen(true);}}}/>}
 {authOpen&&<AuthModal onClose={()=>{setAuthOpen(false);setPendingRoom(null);}} onSuccess={u=>{setUser(u);setAuthOpen(false);if(pendingRoom){setSelectedRoom(pendingRoom);setPendingRoom(null);}}}/>}
 {selectedRoom&&<CheckoutModal room={selectedRoom} dates={stayDates} onClose={()=>setSelectedRoom(null)} onComplete={async()=>{setSelectedRoom(null);await loadBookings();setView("bookings");}}/>}
 </div>;
}
