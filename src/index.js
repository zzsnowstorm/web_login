import React from 'react';
import ReactDOM from 'react-dom';
import App from './page/App';
import 'babel-polyfill';
import './index.css';
import './public/iconfont.css';


window.store || (window.store = {});

window.store.origin = window.location.origin;

ReactDOM.render(<App />, document.getElementById('app'));
