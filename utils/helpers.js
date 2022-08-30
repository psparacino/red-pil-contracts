const { ethers } = require("hardhat");

const NAME = "Proof of Drink"
const SYMBOL = "POD"
const MAX_SUPPLY = 3000
const BASE_URI = "ipfs://<CID>"
const BALANCE_LIMIT = 24

module.exports = {
  NAME,
  SYMBOL,
  MAX_SUPPLY,
  BASE_URI,
  BALANCE_LIMIT,
  deployPod: async function(accountIndex, maxSupply) {
    const accounts = await ethers.getSigners()
    const POD = await ethers.getContractFactory("POD")
    const pod = await POD.deploy(NAME, SYMBOL, accounts[accountIndex].address, maxSupply, BASE_URI, BALANCE_LIMIT)
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
  },
  generateCodes: function(supply) {
    const codes = []
    while (codes.length < supply) {
      const code = (Math.random() * 10000 + Math.random() * 1000 + Math.random() * 100 + Math.random() * 10).toString()
      if (!codes.includes(code)) {
        codes.push(code)
      }
    }
    return codes
  }
}
