// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./Store.sol";
import "./UCPToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AdminProtocol{
    uint private qtyStores;
    address private UCP;
    IERC20 private USDT;
    UCPToken private token;
        
    struct LocalStore{
        uint id;
        address owner;
        string name;
        uint promotionsQty;
        address contractAddress;
    }
    
    struct Promotion{
        uint id;
        uint idStore;
        string name;
    }
    
    mapping(uint => LocalStore) stores;
    mapping(address => mapping(uint => LocalStore)) storesByOwner;
    mapping(address => uint) amountAllowedToMint;

    constructor(address _USDT){
        qtyStores = 1;
        USDT = IERC20(_USDT);
    }

    function updateAddressesAllowedToMint(uint256 _amount) external {
        token.setAddressAllowedToMint(msg.sender, _amount);        
    }    

    function createStore(string memory _name) public {
        Store cStore = new Store(msg.sender, qtyStores, _name, address(USDT), token, address(this));
        require(address(cStore) != address(0), "Contract must be deployed");
        LocalStore memory localStore = LocalStore(qtyStores, msg.sender, _name, 0, address(cStore));
        stores[qtyStores] = localStore;
        storesByOwner[msg.sender][qtyStores] = localStore;
        qtyStores++;
    }

    function getInfoStore(uint _id) public view returns(LocalStore memory store){
        return stores[_id];
    }
    
    function getStoreByOwner(address _owner, uint256 _idStore) internal view returns(LocalStore memory store){
        return storesByOwner[_owner][_idStore];
    }

    function getAmountAllowedToMint(address _contract) public view returns(uint){
        return amountAllowedToMint[_contract];
    }

    function updateAmountAllowedToMint(address _contract, uint256 _amount) external{
        amountAllowedToMint[_contract] = _amount;
    }    
}