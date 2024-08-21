import React, { useState } from 'react';
import Login from './components/Login';
import FunctionSelection from './components/FunctionSelection';
import Agenda from './components/Agenda';
import DailyTasks from './components/DailyTasks';
import CustomList from './components/CustomList';

function App() {
  const [user, setUser] = useState(null);
  const [currentFunction, setCurrentFunction] = useState(null);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleFunctionSelect = (func) => {
    setCurrentFunction(func);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (!currentFunction) {
    return <FunctionSelection onSelect={handleFunctionSelect} />;
  }

  return (
    <div className="app">
      <header>
        <h1>Bem-vindo, {user}</h1>
      </header>
      {currentFunction === 'agenda' && <Agenda />}
      {currentFunction === 'dailyTasks' && <DailyTasks />}
      {currentFunction === 'customList' && <CustomList />}
      <button onClick={() => setCurrentFunction(null)}>Voltar</button>
    </div>
  );
}

export default App;
