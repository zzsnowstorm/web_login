import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login/login';
import './index.css';

window.store || (window.store = {});

window.store.origin = window.location.origin;

ReactDOM.render(<Login />, document.getElementById('app')); 