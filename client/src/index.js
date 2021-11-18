import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MoralisProvider } from "react-moralis";

const APP_ID = "liCnEEPsINRaXPqRjmfOqSkejPRcOjo8QKPLlatF"
const SERVER_URL = "https://dmeeb9p99r9o.usemoralis.com:2053/server"

ReactDOM.render(
    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <App />
    </MoralisProvider>,
    document.getElementById("root"), 
      
);

