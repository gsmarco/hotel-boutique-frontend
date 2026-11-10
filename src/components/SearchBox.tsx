import {useState} from "react";
import type {StayDates} from "../types";
import {dateInputValue,addDays} from "../utils/dates";
import Icon from "./Icon";
import Button from "./Button";

export default function SearchBox({
  dates,
  onDatesChange,
  onSearch,
}: {
  dates: StayDates;
  onDatesChange: (dates: StayDates) => void;
  onSearch: () => void;
}) {
  const [guests, setGuests] = useState(2);
  const today = dateInputValue(new Date());

  const changeCheckIn = (checkIn: string) => {
    if (!checkIn) return;
    const checkOut = dates.checkOut <= checkIn ? addDays(checkIn, 1) : dates.checkOut;
    onDatesChange({ checkIn, checkOut });
  };

  return (
    <div className="search-shell">
      <div className="field">
        <label htmlFor="checkin">Llegada</label>
        <div className="field-control">
          <Icon name="calendar" />
          <input
            id="checkin"
            type="date"
            required
            min={today}
            value={dates.checkIn}
            onChange={(event) => changeCheckIn(event.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="checkout">Salida</label>
        <div className="field-control">
          <Icon name="calendar" />
          <input
            id="checkout"
            type="date"
            required
            min={addDays(dates.checkIn, 1)}
            value={dates.checkOut}
            onChange={(event) => {
              if (event.target.value) onDatesChange({ ...dates, checkOut: event.target.value });
            }}
          />
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
