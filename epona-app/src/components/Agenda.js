import React, { useState } from 'react';
import '../App.css';

function Agenda() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState('');

  const addEvent = () => {
    if (newEvent) {
      setEvents([...events, newEvent]);
      setNewEvent('');
    }
  };

  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <input 
        type="text" 
        placeholder="Adicionar evento/lembrete" 
        value={newEvent}
        onChange={(e) => setNewEvent(e.target.value)}
      />
      <button onClick={addEvent}>Adicionar</button>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event}</li>
        ))}
      </ul>
    </div>
  );
}

export default Agenda;
