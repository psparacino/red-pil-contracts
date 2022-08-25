const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("POD", function() {
  const NAME = "Proof of Drink"
  const SYMBOL = "POD"
  const MAX_SUPPLY = 3000
  const BASE_URI = "ipfs://<CID>/"
  
  async function deploy(accountIndex) {
    const accounts = await ethers.getSigners()
    const POD = await ethers.getContractFactory("POD")
    const pod = await POD.deploy(NAME, SYMBOL, accounts[accountIndex].address, MAX_SUPPLY, BASE_URI)
    await pod.deployed()
    return { pod, accounts }
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function() {
      const { pod } = await deploy(0)
      expect(pod.address)
    })

    it("Should set ownership to deployer", async function () {
      const [account0, account1] = await ethers.getSigners()
      const { pod: pod0 } = await deploy(0)
      const { pod: pod1 } = await deploy(1)

      expect(await pod0.owner()).to.equal(account0.address)
      expect(await pod1.owner()).to.equal(account1.address)
    })
  })

})