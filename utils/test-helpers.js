const { ethers } = require("hardhat");

const NAME = "Proof of Drink"
const SYMBOL = "POD"
const MAX_SUPPLY = 3000
const BASE_URI = "ipfs://<CID>"

module.exports = {
  NAME,
  SYMBOL,
  MAX_SUPPLY,
  BASE_URI,
  deployPod: async function(accountIndex) {
    const accounts = await ethers.getSigners()
    const POD = await ethers.getContractFactory("POD")
    const pod = await POD.deploy(NAME, SYMBOL, accounts[accountIndex].address, MAX_SUPPLY, BASE_URI)
    await pod.deployed()
    return { pod, accounts }
  },
  deployPodFactory: async function() {
    // const [owner, otherAccount] = await ethers.getSigners()
    const PODFactory = await ethers.getContractFactory("PODFactory")
    const podfactory = await PODFactory.deploy()
    await podfactory.deployed()
    return { podfactory }
  },
  fetchDeployEvent: async function(contract, tx) {
    const deployEvent = contract.filters.Deploy()
    const eventArray = await contract.queryFilter(deployEvent, tx.blockHash)
    const eventIndex = eventArray.length ? eventArray.length - 1 : 0
    const parsedEvent = { event: eventArray[eventIndex].event, args: eventArray[eventIndex].args }
    return { ...parsedEvent.args }
  }
}
