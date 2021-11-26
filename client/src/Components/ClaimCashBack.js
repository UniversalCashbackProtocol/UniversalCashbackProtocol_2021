import React, { Component, useContext, useEffect, useState } from "react";
import AdminProtocol from "../artifacts/contracts/AdminProtocol.sol/AdminProtocol.json"
import ProtocolContext from "../context/ProtocolContext"

function ClaimCashBack() {
    const protocolContext = useContext(ProtocolContext)
    const { w3, adminProtocol, store, ucp, usdt, walletAddress, adminProtocolAddress, Moralis} = protocolContext

    const returnOptions = (address, functionName, amount) => {
        const options = {
            contractAddress: address,
            functionName: functionName,
            abi: AdminProtocol.abi,
            params: {
                _amount: amount,
            },
            awaitReceipt: false
        };

        return options;
    }

    const onSubmit = async(form)  => {
        form.preventDefault(); 
        
        const opts = {
            owner_address: walletAddress,
            spender_address: adminProtocol._address,
            address: ucp._address,
            chain: "mumbai"
        };

        const allowance = await Moralis.Web3API.token.getTokenAllowance(opts);

        if(allowance.allowance == 0){
            const tx1 = await ucp.methods.approve(adminProtocol._address, Moralis.Units.ETH("1000000")).send({from: walletAddress})
        }else{
            
            let amount = form.target.Amount.value
            const options = returnOptions(adminProtocol._address, "claimCashBack", Moralis.Units.ETH(amount))
           
            const tx = await Moralis.executeFunction(options)

            tx.on("transactionHash", (hash) => {  })
            .on("receipt", (receipt) => { })
            .on("confirmation", (confirmationNumber, receipt) => {  })
            .on("error", (error) => { });        
                        
        }                      
    }

    return(
        <div className="col-lg-4 border rounded-3 p-3 m-5">
            <h1>Claim CashBack</h1>
            <div>
                <form onSubmit={onSubmit} >
                    <input type="number" id="Amount" className="form-control" placeholder="Amount"/>                    
                    <div className="d-grid gap-2 mt-2">
                        <button type="submit" className="btn btn-primary">Claim CashBack</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ClaimCashBack;