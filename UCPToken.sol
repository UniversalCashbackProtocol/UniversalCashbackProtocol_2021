// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract UCPToken is ERC20, AccessControl {
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN ROLE");


    mapping(address => bool) allowsToMint;

    constructor(address _admin) ERC20("Cashback", "UCP") {
        _setupRole(ADMIN_ROLE, _admin);
    }
    
    /*
    function VerifyAddressAllowsToMint(address _minter) public view returns(bool){
        return allowsToMint[_minter];
    }
    */
        
    function transfer(address _to, uint256 _amount) public virtual override returns (bool) {
        require(_amount >= 1, "The quantity must be divisible by 10");
        transfer(_to, _amount);
        return true;
    }    

    function mintToken(address _to, uint256 _quantity) external payable  {
        require(hasRole(ADMIN_ROLE, msg.sender) == true && _quantity >= 1, "Must be allowed to mint");
        require(msg.value >= 1 ether, "Must pay");
        uint256 tokens = totalSupply();
        uint256 total = tokens + _quantity;
        _mint(_to, total);
    } 
    
}
