// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./POD.sol";

contract PODFactory is Ownable {
    event Deploy(address contractAddress, address indexed creator, address indexed assignedTo);

    function create(
        address assignedOwner,
        uint256 maxSupply,
        string memory baseURI
    ) public onlyOwner {
        address newPODAddress = address(
            new POD("Proof of Drink", "POD", assignedOwner, maxSupply, baseURI)
        );
        emit Deploy(newPODAddress, msg.sender, assignedOwner);
    }
}
