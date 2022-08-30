const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MAX_SUPPLY, BASE_URI, BALANCE_LIMIT, deployPodFactory, fetchDeployEvent } = require('../utils/helpers')

describe("PODFactory", function() {
  describe("Deployment", function () {
    it("Should deploy successfully", async function() {
      const { podfactory } = await deployPodFactory()
      expect(podfactory.address)
    })
  
    it("Should set ownership to deployer", async function () {
      const { podfactory } = await deployPodFactory()
      const [owner] = await ethers.getSigners()
      expect(await podfactory.owner()).to.equal(owner.address)
    })
  })

  describe("Functions", function () {
    it("Should create and deploy new POD contract", async function () {
      const {podfactory} = await deployPodFactory()
      const [,account1] = await ethers.getSigners()

      const tx = await podfactory.create(account1.address, MAX_SUPPLY, BASE_URI, BALANCE_LIMIT)
      await tx.wait()

      const { contractAddress } = await fetchDeployEvent(podfactory, tx)
      
      const podContract = new ethers.Contract(
        contractAddress,
        require('../artifacts/contracts/POD.sol/POD.json').abi,
        account1
      )

      expect(await podContract.name()).to.equal("Proof of Drink")
      expect(await podContract.symbol()).to.equal("POD")
    })

    it("Should create and transferOwnership to assignedOwner param", async function() {
      const {podfactory} = await deployPodFactory()
      const [,account1] = await ethers.getSigners()
      
      const tx = await podfactory.create(account1.address, MAX_SUPPLY, BASE_URI, BALANCE_LIMIT)
      await tx.wait()

      const { contractAddress, assignedTo } = await fetchDeployEvent(podfactory, tx)
      
      const podContract = new ethers.Contract(
        contractAddress,
        require('../artifacts/contracts/POD.sol/POD.json').abi,
        account1
      )

      expect(await podContract.owner()).to.equal(assignedTo).and.equal(account1.address)
    })

    it("Should create and set _maxSupply as maxSupply param", async function () {
      const {podfactory} = await deployPodFactory()
      const [,account1] = await ethers.getSigners()
      
      const tx = await podfactory.create(account1.address, MAX_SUPPLY, BASE_URI, BALANCE_LIMIT)
      await tx.wait()

      const { contractAddress } = await fetchDeployEvent(podfactory, tx)
      
      const podContract = new ethers.Contract(
        contractAddress,
        require('../artifacts/contracts/POD.sol/POD.json').abi,
        account1
      )

      expect(await podContract.maximumSupply()).to.equal(MAX_SUPPLY)
    })

    it("Should create and set _metadataURI as baseURI param", async function () {
      const {podfactory} = await deployPodFactory()
      const [,account1] = await ethers.getSigners()

      const tx = await podfactory.create(account1.address, MAX_SUPPLY, BASE_URI, BALANCE_LIMIT)
      await tx.wait()

      const { contractAddress } = await fetchDeployEvent(podfactory, tx)
      
      const podContract = new ethers.Contract(
        contractAddress,
        require('../artifacts/contracts/POD.sol/POD.json').abi,
        account1
      )

      // Mint and get tokenURI to check base URI
      await podContract.mint(account1.address, 'secretcode')
      expect(await podContract.tokenURI(1)).to.equal(BASE_URI)
    })

    it("Should revert create if not owner", async function () {
      const {podfactory} = await deployPodFactory()
      const [,account1] = await ethers.getSigners()
      await expect(podfactory.connect(account1).create(account1.address, MAX_SUPPLY, BASE_URI, BALANCE_LIMIT))
        .to.be.revertedWith("Ownable: caller is not the owner")
    })
  })

  describe("Events", function () {
    it("Should create and emit Deploy event", async function () {
      const [owner, account1] = await ethers.getSigners()
      const { podfactory } = await deployPodFactory()
      await expect(podfactory.create(account1.address, MAX_SUPPLY, BASE_URI, BALANCE_LIMIT))
        .to.emit(podfactory, "Deploy")
    })
  })
})