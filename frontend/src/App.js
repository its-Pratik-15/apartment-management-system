import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Apartment Management System</h1>
        </header>
        
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={
              <div className="text-center">
                <h2 className="text-xl mb-4">Welcome to Apartment Management System</h2>
                <p className="text-gray-600">
                  A comprehensive solution for managing apartments, tenants, bills, and more.
                </p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;