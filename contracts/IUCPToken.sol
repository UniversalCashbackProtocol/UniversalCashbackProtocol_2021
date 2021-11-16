// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

interface IUCPToken{

    function mintToken(uint256 _amount) external returns(bool);

    function setAddressAllowedToMint(address _contractAddress, uint256 _amount) external;
}