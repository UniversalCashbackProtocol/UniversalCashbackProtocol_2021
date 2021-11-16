// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./AdminProtocol.sol";

contract UCPToken is ERC20 {

    ERC20 private USDT;    
    address private CONTRACT_PROTOCOL;

    mapping(address => bool) contractAllowedToMint;
    mapping(address => uint) amountAllowedToMint;

    constructor(address _USDT) ERC20("Cashback", "UCP") {
        USDT = ERC20(_USDT);        
    }

    function mintToken(uint256 _amount) external virtual {
        require(contractAllowedToMint[msg.sender] == true, "Must be allowed to mint");
        require(amountAllowedToMint[msg.sender] == _amount, "Can't exceed amount allowed to mint");
        //Reset amount allowed to mint
        //setAddressAllowedToMint(msg.sender, 0);
        _mint(msg.sender, _amount);
    } 

    function setAddressAllowedToMint(address _contractAddress, uint256 _amount) external{
        require(CONTRACT_PROTOCOL == msg.sender, "Only de Contract Protocol can add Address");
        contractAllowedToMint[_contractAddress] = true;     
        amountAllowedToMint[_contractAddress] = _amount;   
    }

    function getAmountAllowedToMintByAddress(address _account) public view returns(uint){
        require(contractAllowedToMint[_account], "Account is not allowed to mint");
        return(amountAllowedToMint[_account]);
    }

    function getAddressAllowToMint(address _contractAddress) public view returns(bool){        
        contractAllowedToMint[_contractAddress];
        return true;
    }  
}