import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MoralisProvider } from "react-moralis";

const APP_ID = "A4OGKY8aZQBm4NwxDwhcPjwLADKWBYZJWJKWe0pH"
const SERVER_URL = "https://8nfjwefzngtg.usemoralis.com:2053/server"

ReactDOM.render(
    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <App />
    </MoralisProvider>, 
    document.getElementById("root"), 
      
);

