// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GalaxyCoin is ERC20, Ownable {
    uint256 FOR_ICO = 75000 * (10**18);

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 100000 * (10**18));
    }

    function burnGalaxy(uint256 _amount) public onlyOwner {
        _burn(msg.sender, _amount * (10**18));
    }

    // Add this function:
    function fundICO(address _icoAddr) public onlyOwner {
        transfer(_icoAddr, FOR_ICO);
    }
}
