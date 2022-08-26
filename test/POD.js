const { expect } = require("chai");
const { ethers } = require("hardhat");
const { NAME, SYMBOL, MAX_SUPPLY, BASE_URI, deployPod } = require("../utils/test-helpers");

const CLAIM_CODES = ['ad765fadAD', 'UVed76j49D', 'aadsf83AI$%']

describe("POD", function() {
  describe("Deployment", function () {
    it("Should deploy successfully", async function() {
      const { pod } = await deployPod(0)
      expect(pod.address)
    })

    it("Should set ownership to deployer", async function () {
      const [account0, account1] = await ethers.getSigners()
      const { pod: pod0 } = await deployPod(0)
      const { pod: pod1 } = await deployPod(1)

      expect(await pod0.owner()).to.equal(account0.address)
      expect(await pod1.owner()).to.equal(account1.address)
    })
  })

  describe("Mint", function () {
    it("Should mint and transfer token to 'to' address", async function () {
      const [,account1] = await ethers.getSigners()
      const { pod } = await deployPod(0)
      await expect(pod.mint(account1.address, CLAIM_CODES[0])).to.be.not.reverted
      expect(await pod.balanceOf(account1.address)).to.equal(1)
    })

    it("Should mint and set _claimed mapping of claimCode as true", async function () {
      const [,account1] = await ethers.getSigners()
      const { pod } = await deployPod(0)
      expect(await pod.claimed(CLAIM_CODES[0])).to.be.false
      await expect(pod.mint(account1.address, CLAIM_CODES[0])).to.be.not.reverted
      expect(await pod.claimed(CLAIM_CODES[0])).to.be.true
    })

    it("Should mint again if claimCodes is different", async function () {
      const [,account1, account2] = await ethers.getSigners()
      const { pod } = await deployPod(0)
      await pod.mint(account1.address, CLAIM_CODES[0])
      await expect(pod.mint(account2.address, CLAIM_CODES[1]))
        .to.be.not.reverted
    })

    it("Should revert mint if claimCode is already claimed", async function () {
      const [,account1] = await ethers.getSigners()
      const { pod } = await deployPod(0)
      await expect(pod.mint(account1.address, CLAIM_CODES[0]))
        .to.be.not.reverted
      expect(await pod.claimed(CLAIM_CODES[0])).to.be.true
      await expect(pod.mint(account1.address, CLAIM_CODES[0]))
        .to.be.revertedWith("POD: code has been claimed")
    })

    it("Should revert mint if balanceOf to address is greater than 0", async function () {
      const [,account1] = await ethers.getSigners()
      const { pod } = await deployPod(0)
      await expect(pod.mint(account1.address, CLAIM_CODES[0]))
        .to.be.not.reverted
      await expect(pod.mint(account1.address, CLAIM_CODES[1]))
        .to.be.revertedWith("POD: recipient balance greater than 0")
    })

    it("Should revert mint if supply equals max supply")

    it("Should revert mint if non-owner executes tx", async function () {
      const [,account1,account2] = await ethers.getSigners()
      const { pod } = await deployPod(0)
      await expect(pod.connect(account1).mint(account2.address, CLAIM_CODES[0]))
        .to.be.revertedWith("Ownable: caller is not the owner")
    })
  })

  describe("Claimed", function () {
    it("Should revert claimed if non-owner calls function", async function () {
      const [,account1] = await ethers.getSigners()
      const { pod } = await deployPod(0)
      await expect(pod.connect(account1).claimed(CLAIM_CODES[0]))
        .to.be.revertedWith("Ownable: caller is not the owner")
    })
  })

  describe("TokenURI", function () {
    it("tokenURI should be exact same for all tokenIds", async function () {
      const [,account1, account2] = await ethers.getSigners()
      const { pod } = await deployPod(0)
      await pod.mint(account1.address, CLAIM_CODES[0])
      await pod.mint(account2.address, CLAIM_CODES[1])
      expect(await pod.tokenURI(1)).to.equal(await pod.tokenURI(1)).and.equal(BASE_URI)
    })
  })
})