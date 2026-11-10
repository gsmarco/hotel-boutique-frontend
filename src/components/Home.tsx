import {useState} from "react";
import type {Room,StayDates} from "../types";
import {photos} from "../utils/data";
import Icon from "./Icon";
import Button from "./Button";
import SearchBox from "./SearchBox";

export default function Home({
  onBook,
  dates,
  onDatesChange,
  rooms,
}: {
  onBook: (room: Room) => void;
  rooms: Room[];
  dates: StayDates;
  onDatesChange: (dates: StayDates) => void;
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
          <SearchBox
            dates={dates}
            onDatesChange={onDatesChange}
            onSearch={() => document.getElementById("room-results")?.scrollIntoView({ behavior: "smooth" })}
          />
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
