import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MoralisProvider } from "react-moralis";
import 'bootstrap/dist/css/bootstrap.css'

const APP_ID = "QCv3F3K5IvIVP05oN6RNLUhXFJmAD9CAl09ge0Oo"
const SERVER_URL = "https://nrdzlizkmtj3.usemoralis.com:2053/server"

ReactDOM.render(
    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <App />
    </MoralisProvider>, 
    document.getElementById("root"), 
      
);

