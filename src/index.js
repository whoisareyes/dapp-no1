import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import App from './components/App';


ReactDOM.render(
    <Provider store={configureStore()}>
      <App />
    </Provider>,
  document.getElementById('root')
);
