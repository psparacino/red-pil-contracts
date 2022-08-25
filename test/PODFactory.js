const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PODFactory", function() {
  const MAX_SUPPLY = 3000
  const BASE_URI = "ipfs://<CID>"

  async function deploy() {
    // const [owner, otherAccount] = await ethers.getSigners()
    const PODFactory = await ethers.getContractFactory("PODFactory")
    const podfactory = await PODFactory.deploy()
    await podfactory.deployed()
    return { podfactory }
  }

  async function fetchEvent(contract, tx) {
    const deployEvent = contract.filters.Deploy()
    const eventArray = await contract.queryFilter(deployEvent, tx.blockHash)
    const eventIndex = eventArray.length ? eventArray.length - 1 : 0
    const parsedEvent = { event: eventArray[eventIndex].event, args: eventArray[eventIndex].args }
    return { ...parsedEvent.args }
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function() {
      const { podfactory } = await deploy()
      expect(podfactory.address)
    })
  
    it("Should set ownership to deployer", async function () {
      const { podfactory } = await deploy()
      const [owner] = await ethers.getSigners()
      expect(await podfactory.owner()).to.equal(owner.address)
    })
  })

  describe("Functions", function () {
    it("Should create and deploy new POD contract", async function () {
      const {podfactory} = await deploy()
      const [,account1] = await ethers.getSigners()
      const tx = await podfactory.create(account1.address, MAX_SUPPLY, BASE_URI)
      await tx.wait()

      const { contractAddress, assignedTo } = await fetchEvent(podfactory, tx)
      
      const podContract = new ethers.Contract(
        contractAddress,
        require('../artifacts/contracts/POD.sol/POD.json').abi,
        account1
      )

      expect(await podContract.name()).to.equal("Proof of Drink")
      expect(await podContract.symbol()).to.equal("POD")
    })

    it("Should create and transferOwnership to assignedOwner param", async function() {
      const {podfactory} = await deploy()
      const [,account1] = await ethers.getSigners()
      await podfactory.create(account1.address, MAX_SUPPLY, BASE_URI)
      const tx = await podfactory.create(account1.address, MAX_SUPPLY, BASE_URI)
      await tx.wait()

      const { contractAddress, assignedTo } = await fetchEvent(podfactory, tx)
      
      const podContract = new ethers.Contract(
        contractAddress,
        require('../artifacts/contracts/POD.sol/POD.json').abi,
        account1
      )

      expect(await podContract.owner()).to.equal(assignedTo).and.equal(account1.address)
    })

    it("Should create and set _maxSupply as maxSupply param", async function () {
      const {podfactory} = await deploy()
      const [,account1] = await ethers.getSigners()
      await podfactory.create(account1.address, MAX_SUPPLY, BASE_URI)
      const tx = await podfactory.create(account1.address, MAX_SUPPLY, BASE_URI)
      await tx.wait()

      const { contractAddress } = await fetchEvent(podfactory, tx)
      
      const podContract = new ethers.Contract(
        contractAddress,
        require('../artifacts/contracts/POD.sol/POD.json').abi,
        account1
      )

      expect(await podContract.maximumSupply()).to.equal(MAX_SUPPLY)
    })

    it("Should create and set _metadataURI as baseURI param", async function () {
      const {podfactory} = await deploy()
      const [,account1] = await ethers.getSigners()
      await podfactory.create(account1.address, MAX_SUPPLY, BASE_URI)
      const tx = await podfactory.create(account1.address, MAX_SUPPLY, BASE_URI)
      await tx.wait()

      const { contractAddress } = await fetchEvent(podfactory, tx)
      
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
      const {podfactory} = await deploy()
      const [,account1] = await ethers.getSigners()
      await expect(podfactory.connect(account1).create(account1.address, MAX_SUPPLY, BASE_URI))
        .to.be.revertedWith("Ownable: caller is not the owner")
    })
  })

  describe("Events", function () {
    it("Should create and emit Deploy event", async function () {
      const [owner, account1] = await ethers.getSigners()
      const { podfactory } = await deploy()
      await expect(podfactory.create(account1.address, MAX_SUPPLY, BASE_URI))
        .to.emit(podfactory, "Deploy")
    })
  })
})