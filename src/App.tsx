import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Themes from './pages/Themes';
import Chat from './pages/Chat';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import BusinessGenerator from './pages/BusinessGenerator';
import DatabaseMap from './pages/DatabaseMap';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/themes" element={<Themes />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/business-generator" element={<BusinessGenerator />} />
      <Route path="/database-map" element={<DatabaseMap />} />
    </Routes>
  );
}

export default App;
