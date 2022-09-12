const hre = require("hardhat");
const ethers = require("ethers");

const abi = require("../artifacts/contracts/POD.sol/POD.json").abi

// blockscout API: https://blockscout.com/xdai/mainnet/api-docs

async function main() {
    const data = '0xd0def521000000000000000000000000d1d8e452a864388280b714537cbead6ff9e285300000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000a4471476f50544b63737200000000000000000000000000000000000000000000'

    const iface = new ethers.utils.Interface(abi)

    const result = iface.decodeFunctionData('mint', data);



  console.log(
    `Decoded data: ${result}`,
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
