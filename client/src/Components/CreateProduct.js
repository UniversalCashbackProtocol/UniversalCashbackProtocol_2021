import React, { Component, useContext, useEffect, useState } from "react";
import ProtocolContext from "../context/ProtocolContext"
import { useMoralis } from "react-moralis";
import Store from "../artifacts/contracts/Store.sol/Store.json"

function CreateProduct(){
    const protocolContext = useContext(ProtocolContext)
    const { adminProtocol, store, ucp, walletAddress} = protocolContext
    const { Moralis } = useMoralis();
    const [qtyProducts, setQtyProducts] = useState(0)
    const [products, setProducts] = useState([])

    const storeAddress = "0x605D3E9AAB0520858f4Cf9531479F1b2dA448cD5"
    
    const loadQtyProducts = async() => {
        const web3 = await Moralis.enableWeb3()
        const contract = await new web3.eth.Contract(Store.abi, storeAddress);

        let qtyProducts = await contract.methods.getQtyProducts().call()
        setQtyProducts(qtyProducts)
        console.log(qtyProducts);

        const auxProduct = await contract.methods.getQtyPromotions().call()   
        console.log(auxProduct);
    }

    const loadProducts = async() => {
        const web3 = await Moralis.enableWeb3()
        const contract = new web3.eth.Contract(Store.abi, storeAddress);

        let products = []

        const auxProduct = await contract.methods.getQtyProducts().call()            
        
        console.log(auxProduct); 
    }

    const returnOptions = (address) => {
        const options = {
            contractAddress: address,
            functionName: "createProduct",
            abi: Store.abi,
            params: {
                _SKU: "BURGER",          
                _priceProduct: 10,
                _tokensPerProduct: 10
            },
        };

        return options;
    }

    const onSubmit = async(form) => {
        form.preventDefault();
        
        console.log(form)
        const options = returnOptions(storeAddress)
        const newProduct = await Moralis.executeFunction(options)
        console.log(newProduct)
    }

    useEffect(() => {        
        loadQtyProducts();
    },[])

    
    useEffect(() => {        
       
    },[qtyProducts])

    return(
        <div>
            <h1>Create Product</h1>
            <h1>Store Quantity Products: {qtyProducts}</h1>
            <form onSubmit={onSubmit} >
                <label>Store: </label>
                <input type="text" text="Store" id="Store" />
                <label>SKU: </label>
                <input type="text" text="SKU" id="SKU" />
                <label>Price: </label>
                <input type="text" text="Price" id="Price" />
                <label>Cashback: </label>
                <input type="text" text="Cashback" id="Cashback" />
                <button type="submit" className="btn btn-primary m-2">Create Product</button>
            </form>
        <div>

        </div>
    </div>
    )
}

export default CreateProduct;

