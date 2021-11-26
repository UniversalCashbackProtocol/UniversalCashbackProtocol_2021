import React, { Component, useContext, useEffect, useState } from "react";
import AdminProtocol from "../artifacts/contracts/AdminProtocol.sol/AdminProtocol.json"
import ProtocolContext from "../context/ProtocolContext"

function Information() {
    const protocolContext = useContext(ProtocolContext)
    const { w3, adminProtocol, store, ucp, usdt, walletAddress, Moralis} = protocolContext

    const [ protocolTreasure, setProtocolTreasure] = useState(0)
    const [ usserUCP, setUserUCP] = useState(0)

    const loadTreasure = async() => {
        let usser = await ucp.methods.balanceOf(walletAddress).call()
        let treasure = await usdt.methods.balanceOf(adminProtocol._address).call()

        usser = Moralis.Units.FromWei(usser)
        treasure = Moralis.Units.FromWei(treasure, 6)

        setProtocolTreasure(treasure)
        setUserUCP(usser)
    }

    useEffect(() => {
        
        loadTreasure()
    }, [walletAddress]);

    return(
        <div>
            <h1>Protocol Information</h1>
            <h4>Protocol USDT: {protocolTreasure}</h4>
            <h4>Your UCP: {usserUCP}</h4>
        </div>
    )
}

export default Information;