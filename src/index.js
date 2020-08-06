import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App'; 


const refresh = () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

refresh()

