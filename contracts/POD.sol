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
        require(balanceOf(to) < 24, "POD: recipient balance greater than 24");
        uint256 tokenId = _supply + 1;
        _claimed[claimCode] = true;
		_supply++;
        _safeMint(to, tokenId);
    }

    function claimed(string memory claimCode)
        external
        view
        onlyOwner
        returns (bool)
    {
        return _claimed[claimCode];
    }

		function supply() external view returns (uint256) {
			return _supply;
		}

		function maximumSupply() external view returns (uint256) {
			return _maxSupply;
		}

		function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);
        return _baseURI();
    }

    function _baseURI() internal view override returns (string memory) {
        return _metadataURI;
    }
}
