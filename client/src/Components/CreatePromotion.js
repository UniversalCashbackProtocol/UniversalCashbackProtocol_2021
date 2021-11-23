import React, { Component, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

function CreatePromotion(){

    useEffect( () => {
        const load = async() => {
          try {
            
          } catch (error) {
            alert("Failed to load information")
          }
        }
      })
      
    
    return(
      <div>
        <h1>Create Promotion</h1>
        <form>
            <label>UCP Amount: </label>
            <input type="text" text="UCPAmount"/>
            <label>Start Date: </label>
            <input type="text" text="StartDate"/>
            <label>End date: </label>
            <input type="text" text="EndDate"/>
            <button type="submit" className="btn btn-primary m-2">Create Promotion</button>  
        </form>
        </div>
    )
}

export default CreatePromotion;