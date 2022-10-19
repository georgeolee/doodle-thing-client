import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './routes/app/App';
// import reportWebVitals from './reportWebVitals';

//redux
import {Provider} from 'react-redux';
import { store } from './redux/store';

//react router
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import { Settings, action as settingsAction } from './routes/settings/settings';



const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        index: true,
        element: <></>
      },
      {
        path: 'settings',
        element: <Settings/>,
        action: settingsAction
      },

    ]
  }
])


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
