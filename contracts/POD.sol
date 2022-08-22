// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract POD is ERC721, Ownable {
	uint256 private _supply;
	uint256 private _maxSupply;
	string private _metadataURI;
	mapping(string => bool) private _claimed;

	constructor(
		string memory name,
		string memory symbol,
		address owner,
		uint256 maxSupply,
		string memory baseURI
	) ERC721(name, symbol) {
		_metadataURI = baseURI;
		_maxSupply = maxSupply;
		transferOwnership(owner);
	}

	function mint(address to, string memory claimCode) external onlyOwner {
		require(!_claimed[claimCode], "POD: code has been claimed");
		require(_supply < _maxSupply, "POD: max supply has been reached");
		require(balanceOf(to) == 0, "POD: recipient balance greater than 0");
		uint256 tokenId = _supply + 1;
		_claimed[claimCode] = true;
		_safeMint(to, tokenId);
	}

	function claimed(string memory claimCode) external onlyOwner view returns (bool) {
		return _claimed[claimCode];
	}

	function _baseURI() internal override view returns (string memory) {
		return _metadataURI;
	}
}