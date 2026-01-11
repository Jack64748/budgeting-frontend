import React from 'react';
import ReactDOM from 'react-dom/client';
import './pages/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root')); connecting 
// the JavaScript to the HTML browser searches for root then react takes control of that
// div React "owns" that part of the page and will manage everything that happens inside it.
const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render() (The Injection) This is the command that actually puts pixels on the screen.
// <App />: This tells React to start rendering the code found in your App.js file.
// <React.StrictMode>: This is a helper tool used during development.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
