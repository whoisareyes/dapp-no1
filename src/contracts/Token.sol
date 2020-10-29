pragma solidity ^0.5.16;

contract Token {
    string public name = "Wario Token";
    string public symbol = 'WARIO';
    uint256 public decimals = 18;
    uint256 public totalSupply;

    constructor() public {
        totalSupply =  1000000000 * (10 ** decimals);
    }
}