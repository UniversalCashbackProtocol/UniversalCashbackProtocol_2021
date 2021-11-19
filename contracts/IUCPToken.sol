// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

interface IUCPToken{

    function mintToken(uint256 _amount) external returns(bool);

    function setAddressAllowedToMint(address _contractAddress, uint256 _amount) external;

    function transfer(address recipient, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function burn(uint256 amount) external;

    event Transfer(address indexed from, address indexed to, uint256 value);
}