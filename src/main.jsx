import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from "./App";
import { store } from "./redux/store";

import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";

// ----------------------------------------------------------------------
// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
  <Provider store={store}>
    <HelmetProvider>
      <BrowserRouter>
    <ToastContainer />
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </Provider>
  </>
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
