
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Themes from './pages/Themes';
import DatabaseMap from './pages/DatabaseMap';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Themes />} />
      <Route path="/themes" element={<Themes />} />
      <Route path="/database-map" element={<DatabaseMap />} />
    </Routes>
  );
}

export default App;
