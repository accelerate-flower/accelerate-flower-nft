//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract AFNFT is ERC721URIStorage, AccessControl, Ownable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    bool public isOpenMint;

    constructor() ERC721("Accelererate Flower NFT", "AFNFT") {
        _grantRole(MINTER_ROLE, msg.sender);
        isOpenMint = false;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyMinter() {
        require(isOpenMint || hasRole(MINTER_ROLE, msg.sender), "Minting is restricted.");
        _;
    }

    function mintNFT(address recipient, string memory tokenURI)
        public onlyMinter
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    // Set whether the mint is open to anyone.
    function setIsOpenMint(bool _isOpen) public onlyOwner {
        isOpenMint = _isOpen;
    }

    // Check if the address can mint an NFT.
    function canMint(address _address) public view returns (bool) {
        return isOpenMint || hasRole(MINTER_ROLE, _address);
    }

    // Add a minter.
    function addMinter(address _address) public onlyOwner {
        _grantRole(MINTER_ROLE, _address);
    }
}
