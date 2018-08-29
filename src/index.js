import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login/login';
import './index.css';

window.store || (window.store = {});

ReactDOM.render(<Login />, document.getElementById('app')); 