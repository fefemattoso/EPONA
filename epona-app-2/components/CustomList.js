import React, { useState } from 'react';
import './CustomList.css';

function CustomList() {
  const [lists, setLists] = useState([]);
  const [newListItem, setNewListItem] = useState('');

  const addListItem = () => {
    if (newListItem) {
      setLists([...lists, { item: newListItem, completed: false }]);
      setNewListItem('');
    }
  };

  const toggleComplete = (index) => {
    const updatedLists = lists.map((list, i) => 
      i === index ? { ...list, completed: !list.completed } : list
    );
    setLists(updatedLists);
  };

  const removeItem = (index) => {
    const updatedLists = lists.filter((_, i) => i !== index);
    setLists(updatedLists);
  };

  return (
    <div className="custom-list">
      <h2>Lista Personalizada</h2>
      <div className="input-container">
        <input 
          type="text" 
          placeholder="Adicionar item à lista" 
          value={newListItem}
          onChange={(e) => setNewListItem(e.target.value)}
        />
        <button className="add-button" onClick={addListItem}>Adicionar</button>
      </div>
      <ul>
        {lists.map((list, index) => (
          <li 
            key={index} 
            className={list.completed ? 'completed' : ''} 
            onClick={() => toggleComplete(index)}
          >
            {list.item}
            <button className="remove-button" onClick={(e) => { e.stopPropagation(); removeItem(index); }}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomList;
