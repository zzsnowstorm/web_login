import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login/login';
import 'babel-polyfill';
import './index.css';
import './public/iconfont.css';


window.store || (window.store = {});

window.store.origin = window.location.origin;

ReactDOM.render(<Login />, document.getElementById('app'));
