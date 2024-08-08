import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './i18n';
import './App.css';
import Calculator from './components/Calculator/Calculator';

const App = () => {
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/en" />} />
        <Route path="/:lang" element={<Calculator />} />
      </Routes>
    </BrowserRouter></div>
  );
};
export default App;