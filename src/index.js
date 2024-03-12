import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import Signin from './signin.jsx';
import SignUp from './signup.jsx';
import TextEditor from './texteditor.jsx';
import Dashboard from './dashboard.jsx';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);