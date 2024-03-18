import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';
import Signin from './signin.jsx';
import SignUp from './signup.jsx';
import TextEditor from './texteditor.jsx';
import Summarizer from './summarizer.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/texteditor" element={<TextEditor />} />
        <Route path="/summarizer" element={<Summarizer />} />
        <Route path="/" element={<TextEditor />} />
      </Routes>
    </Router>
  </React.StrictMode>
);