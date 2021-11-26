import React, { Component, useContext, useEffect, useState } from "react";
import Store from "../artifacts/contracts/Store.sol/Store.json"
import ProtocolContext from "../context/ProtocolContext"

function BuyProduct() {
    const protocolContext = useContext(ProtocolContext)
    const { w3, adminProtocol, store, ucp, usdt, walletAddress, adminProtocolAddress, Moralis} = protocolContext
    const [products, setProducts] = useState([])
    const [qtyProducts, setQtyProducts] = useState(0)

    const getQtyProducts = async() => {
        let qty =  await store.methods.getQtyProducts().call()
        setQtyProducts(qty)
    }
    
    const getProducts = async() => {
        let products = []

        for (let i = 1; i < qtyProducts; i++) {
            const auxProduct = await store.methods.getProductById(i).call()            
            products.push(auxProduct)              
        }

        setProducts(products)
    }

    const returnOptions = (address, functionName, idProduct) => {
        const options = {
            contractAddress: address,
            functionName: functionName,
            abi: Store.abi,
            params: {
                _idPromotion: 1,
                _idProduct: idProduct
            },
            awaitReceipt: false
        };

        return options;
    }

    const onSubmit = async(form)  => {
        form.preventDefault(); 
        
        const opts = {
            owner_address: walletAddress,
            spender_address: store._address,
            address: "0xbd21a10f619be90d6066c941b04e340841f1f989",
            chain: "mumbai"
        };

        const allowance = await Moralis.Web3API.token.getTokenAllowance(opts);

        if(allowance.allowance == 0){
            const tx1 = await usdt.methods.approve(store._address, Moralis.Units.ETH("1000000")).send({from: walletAddress})
        }else{
            let idProduct = form.target.IdProduct.value
            const options = returnOptions(store._address, "buyProduct", idProduct)

            const tx = await Moralis.executeFunction(options)

            tx.on("transactionHash", (hash) => { console.log(hash) })
            .on("receipt", (receipt) => { console.log("receipt" + receipt) })
            .on("confirmation", (confirmationNumber, receipt) => { console.log("confirmation" + receipt) })
            .on("error", (error) => { console.log("error" + error) });
        }                      
    }

    useEffect(() => {
        getQtyProducts()        
    },[])

    useEffect(() => {
        getProducts()        
    },[qtyProducts])

    if(products.length === 0){
        return(<div><h1>Loading Products ... </h1> </div>)
    }
    return(
        <div>
            <h1>Products: {qtyProducts}</h1>
            <div>
                {products.map((item, i) => {
                    return(
                        <form key={i} onSubmit={onSubmit} id={"productForm" + i}>
                        <input type="text" id="IdProduct" defaultValue={item.id} />   
                        <label>Name: </label>
                        <input type="text" id="ProductName" defaultValue={item.SKU}/>                                                                                               
                        <label>Price USDT: </label>
                        <label>{Moralis.Units.FromWei(item.price, 6)} </label>                        
                        <label>UCP Givens: </label>
                        <label>{Moralis.Units.FromWei(item.tokenGivens, 18)}</label>                        
                        <button type="submit" className="btn btn-primary m-2">Buy Product</button>                        
                    </form>
                    )
                } )}
            </div>
        </div>
    )
}

export default BuyProduct;