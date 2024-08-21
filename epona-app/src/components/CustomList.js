import React, { useState } from 'react';
import '../App.css';


function CustomList() {
  const [lists, setLists] = useState([]);
  const [newListItem, setNewListItem] = useState('');

  const addListItem = () => {
    if (newListItem) {
      setLists([...lists, newListItem]);
      setNewListItem('');
    }
  };

  return (
    <div className="custom-list">
      <h2>Lista Personalizada</h2>
      <input 
        type="text" 
        placeholder="Adicionar item à lista" 
        value={newListItem}
        onChange={(e) => setNewListItem(e.target.value)}
      />
      <button onClick={addListItem}>Adicionar</button>
      <ul>
        {lists.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default CustomList;
