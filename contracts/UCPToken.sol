// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UCPToken is ERC20 {

    mapping(address => bool) allowsToMint;

    constructor(uint256 initialSupply) ERC20("Cashback", "UCP") {
        _mint(msg.sender, initialSupply);
    }
        
    function transfer(address _to, uint256 _amount) public virtual override returns (bool) {
        require(_amount >= 1, "Minimun 1 Token");
        transfer(_to, _amount);
        return true;
    }    

    function mintToken(address _to, uint256 _amount) public virtual {
        require(allowsToMint[msg.sender] == true, "Must be allowed to mint");
        _mint(_to, _amount);
    } 

    function addAddressAllowToMint() public view returns(bool){
        require(allowsToMint[msg.sender] == false, "it exists");
        allowsToMint[msg.sender];
        return true;
    }  
}