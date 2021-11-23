import React, { Component, useContext, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import AdminProtocol from "../artifacts/contracts/AdminProtocol.sol/AdminProtocol.json"
import Store from "../artifacts/contracts/Store.sol/Store.json"
import ProtocolContext from "../context/ProtocolContext"


function ListStore() {
    const protocolContext = useContext(ProtocolContext)
    const { w3, adminProtocol, store, ucp, walletAddress, adminProtocolAddress, Moralis} = ProtocolContext

    
}