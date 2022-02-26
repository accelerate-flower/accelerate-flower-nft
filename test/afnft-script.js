const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AFNFT", function () {
  it("Should verify AFNFT is mintable", async function () {
    const NFT = await ethers.getContractFactory("AFNFT");
    const nft = await NFT.deploy();
  
    await nft.deployed();
  
    const [owner, addr1, addr2] = await ethers.getSigners();
  
    await expect(nft.connect(owner).mintNFT(owner.address, "https://test.com"))
      .to.emit(
        nft,
        "Transfer"
      )
      .withArgs(ethers.constants.AddressZero, owner.address, 1);

    await expect(await nft.connect(addr1).ownerOf(1))
           .to.equal(owner.address, "First item for owner address.");      
  });
  it("Should verify AFNFT is not mintable by others", async function () {
    const NFT = await ethers.getContractFactory("AFNFT");
    const nft = await NFT.deploy();
  
    await nft.deployed();
  
    const [owner, addr1, addr2] = await ethers.getSigners();
  
    await expect(nft.connect(addr1).mintNFT(addr2.address, "https://test.com"))
          .to.be.revertedWith('Minting is restricted.');
    await expect(nft.connect(addr1).setIsOpenMint(true))
           .to.be.revertedWith("Ownable: caller is not the owner");      
  });
  it("Should verify AFNFT mintable by others when added", async function () {
    const NFT = await ethers.getContractFactory("AFNFT");
    const nft = await NFT.deploy();
  
    await nft.deployed();
  
    const [owner, addr1, addr2] = await ethers.getSigners();
    await nft.addMinter(addr1.address);

    await expect(nft.connect(addr1).mintNFT(addr2.address, "https://test.com"))
      .to.emit(
        nft,
        "Transfer"
      )
      .withArgs(ethers.constants.AddressZero, addr2.address, 1);

    await expect(nft.connect(addr2).mintNFT(addr1.address, "https://test.com"))
      .to.be.revertedWith('Minting is restricted.');
  });

  it("Should verify AFNFT mintable when open", async function () {
    const NFT = await ethers.getContractFactory("AFNFT");
    const nft = await NFT.deploy();
  
    await nft.deployed();
  
    const [owner, addr1, addr2] = await ethers.getSigners();

    await expect(nft.connect(addr2).mintNFT(addr1.address, "https://test.com"))
      .to.be.revertedWith('Minting is restricted.');

    
    await nft.setIsOpenMint(true);

    await expect(nft.connect(addr2).mintNFT(addr1.address, "https://test.com"))
      .to.emit(
        nft,
        "Transfer"
      )
      .withArgs(ethers.constants.AddressZero, addr1.address, 1);

    
    await nft.setIsOpenMint(false);  

    await expect(nft.connect(addr2).mintNFT(addr1.address, "https://test.com"))
      .to.be.revertedWith('Minting is restricted.');
  });
});