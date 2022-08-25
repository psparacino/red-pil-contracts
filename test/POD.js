const { expect } = require("chai");
const { ethers } = require("hardhat");
const { NAME, SYMBOL, MAX_SUPPLY, BASE_URI, deployPod } = require("../utils/test-helpers");

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

})