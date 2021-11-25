// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./AdminProtocol.sol";

contract UCPToken is ERC20, Ownable, ERC20Burnable {

    ERC20 private USDT;    
    address private CONTRACT_PROTOCOL;

    mapping(address => bool) contractAllowedToMint;
    mapping(address => uint) amountAllowedToMint;

    constructor(address _USDT) ERC20("Cashback", "UCP") {
        USDT = ERC20(_USDT);     
        _mint(msg.sender, 1000000000000000000000000000);
    }

    function mintToken(uint256 _amount) external virtual returns(bool){
        require(contractAllowedToMint[msg.sender] == true, "Must be allowed to mint");
        require(amountAllowedToMint[msg.sender] == _amount, "Can't exceed amount allowed to mint");
        //Reset amount allowed to mint        
        amountAllowedToMint[msg.sender] = 0;   
        _mint(msg.sender, _amount);
        emit TokenMinted(_amount, msg.sender);
        return true;        
    } 

    function setContractProtocol(address _contractAddress) public onlyOwner returns(bool){
        require(_contractAddress != address(0), "Addres must be valid");
        CONTRACT_PROTOCOL = _contractAddress; 
        return true;
    }

    function setAddressAllowedToMint(address _contractAddress, uint256 _amount) external{
        require(CONTRACT_PROTOCOL == msg.sender, "Only the Contract Protocol can add Address");
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

    event TokenMinted(uint _amount, address _to);
}