import React from 'react';
import ReactDOM from 'react-dom';
import MainApp from './mainApp';

window.addEventListener("load", () => {
  ReactDOM.render(<MainApp />, document.getElementById('react-container'));
});
