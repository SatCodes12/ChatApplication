import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import { useChatContext } from './context/ChatContext';

function App() {
  const { user } = useChatContext();

  return (
    <div className="app-container">
      <Routes>
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Chat /> : <Navigate to="/auth" />} />
      </Routes>
    </div>
  );
}

export default App;
