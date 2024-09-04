import React from 'react';
import './FunctionSelection.css'; 

function FunctionSelection({ onSelect }) {
  return (
    <div className="function-selection">
      <h2>Selecione uma Função</h2>
      <div>
        <button onClick={() => onSelect('agenda')}>Agenda</button>
        <button onClick={() => onSelect('dailyTasks')}>Lista de Tarefas Diárias</button>
        <button onClick={() => onSelect('customList')}>Lista Personalizada</button>
      </div>
      
      {/* Adicionando as folhinhas */}
      <img src={require('../assets/planta2.png')} className="leaf-top-left" alt="folha superior esquerda" />
      <img src={require('../assets/planta.png')} className="leaf-bottom-right" alt="folha inferior direita" />
    </div>
  );
}

export default FunctionSelection;
