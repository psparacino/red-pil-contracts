require("dotenv").config()
const ethers = require("ethers");
const { fetchDeployEvent } = require("../../utils/helpers");

const address = process.env.FACTORY_ADDRESS
const interface = require("../../artifacts/contracts/PODFactory.sol/PODFactory.json")
const provider = new ethers.providers.JsonRpcProvider(process.env.RINKEBY_PROVIDER_URL)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

const BASE_URI = process.env.BASE_URI
const ASSIGNED_OWNER_ADDRESS = process.env.POD_OWNER
const MAX_SUPPLY = 3300
const BALANCE_LIMIT = 24

async function main() {
  const podFactory = new ethers.Contract(
    address,
    interface.abi,
    signer
  );

  console.log(`Connected to POD Factory: ${podFactory.address}`)
  console.log(`Owner is current signer: ${await podFactory.owner() === signer.address}\n`)

  const tx = await podFactory.create(
    ASSIGNED_OWNER_ADDRESS,
    MAX_SUPPLY,
    BASE_URI,
    BALANCE_LIMIT
  );
  await tx.wait()

  const { contractAddress, creator, assignedTo } = await fetchDeployEvent(podFactory, tx)
  console.log(`Deployed POD on Rinkeby to ${contractAddress}`)
  console.log(`by ${creator}\n`)
  console.log(`Ownership assigned to ${assignedTo}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
