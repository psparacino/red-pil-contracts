// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract POD is ERC721, Ownable {
    uint256 private _supply;
    uint256 private _maxSupply;
    string private _metadataURI;
    uint256 private _balanceLimit;
    mapping(string => bool) private _claimed;

    constructor(
        string memory name,
        string memory symbol,
        address owner,
        uint256 maxSupply,
        string memory baseURI,
        uint256 limit
    ) ERC721(name, symbol) {
        _metadataURI = baseURI;
        _maxSupply = maxSupply;
        _balanceLimit = limit;
        transferOwnership(owner);
    }

    /**
     * @dev Mints token to recipient address by accepting an unclaimed code
     *
     * @param to - recipient address of token
     * @param claimCode - unique random (encrypted) code string to allow mint
     *
     * note claimCode cannot be used more than once.
     * note to must have a balance less than _balanceLimit.
     */
    function mint(address to, string memory claimCode) external onlyOwner {
        require(!_claimed[claimCode], "POD: code has been claimed");
        require(_supply < _maxSupply, "POD: max supply has been reached");
        require(balanceOf(to) < _balanceLimit, "POD: recipient balance greater than limit");
        uint256 tokenId = _supply + 1;
        _claimed[claimCode] = true;
		_supply++;
        _safeMint(to, tokenId);
    }

    /**
     * @dev Returns a boolean to indicate if claimCode has been used to mint token
     *
     * @param claimCode - unique random (encrypted) code string to allow mint
     *
     * note Only owner can call this view function.
     */
    function claimed(string memory claimCode)
        external
        view
        onlyOwner
        returns (bool)
    {
        return _claimed[claimCode];
    }

    /**
     * @dev Returns supply of tokens
     */
    function supply() external view returns (uint256) {
        return _supply;
    }

    /**
     * @dev Returns maximum supply of tokens allowed to be minted
     */
    function maximumSupply() external view returns (uint256) {
        return _maxSupply;
    }

    /**
     * @dev Returns maximum balance allowed to be minted to an address
     *
     * note Only owner can call this view function.
     */
    function balanceLimit() external view onlyOwner returns (uint256) {
        return _balanceLimit;
    }

	function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireMinted(tokenId);
        return _baseURI();
    }

    function _baseURI() internal view override returns (string memory) {
        return _metadataURI;
    }
}
