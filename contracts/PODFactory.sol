// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./POD.sol";
import "hardhat/console.sol";


contract PODFactory is Ownable {
    event Deploy(address contractAddress, address indexed creator, address indexed assignedTo);

    function create(
        address assignedOwner,
        uint256 maxSupply,
        string memory baseURI,
        uint256 balanceLimit
    ) public onlyOwner {
        address newPODAddress = address(
            new POD("Proof of Drink", "POD", assignedOwner, maxSupply, baseURI, balanceLimit)
        );
        emit Deploy(newPODAddress, msg.sender, assignedOwner);
    }
}
