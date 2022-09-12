const hre = require("hardhat");
const ethers = require("ethers");
const abi = require("../artifacts/contracts/POD.sol/POD.json").abi
const fetch = require('node-fetch');
const HttpProvider = require( 'web3-providers-http')

// blockscout API: https://blockscout.com/xdai/mainnet/api-docs
// https://blockscout.com/xdai/mainnet/api  0x0B202DE2Ac138C7ac0f0A6CF2598DA71d4d9A1F3

// const hre = require("hardhat");
// const pod = await hre.ethers.getContractAt("POD", "0xcF439318714eE692a33F18c39869799aBe880A71");

async function main() {

    let httpweb3provider = new HttpProvider(process.env.GNOSIS_PROVIDER_URL)
    const provider = new ethers.providers.Web3Provider(httpweb3provider)
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const contract = new ethers.Contract("0xcF439318714eE692a33F18c39869799aBe880A71", abi, signer )

    await fetch(`https://blockscout.com/xdai/mainnet/api?module=account&action=txlist&address=0x0B202DE2Ac138C7ac0f0A6CF2598DA71d4d9A1F3`)  
    .then((response) => response.json())
    .then(async(data) => {
        const txns = data.result;
        // const claimCodes = [];

        const claimCodes = {};

        for (let i = 0; i < txns.length; i++) {
            const input = txns[i].input;    
            const pair = (decode(input))

            if (claimCodes[pair.claimCode]) {
                claimCodes[pair.claimCode] += 1
            }else  {
                claimCodes[pair.claimCode] = 1;
            }


            // if (!claimCodes.includes(pair.claimCode)) {
                
            //     const tx = await contract.mint(pair.to, pair.claimCode)
            //     const receipt = await tx.wait()
            //     console.log("TXN RECEIPT", receipt)  

            //     claimCodes.push(pair.claimCode)
            // }
            

        }

        let finalArray = []
        for (let pair in claimCodes) {
            if (claimCodes[pair] > 1) {
                console.log(pair)
            }
        }

    });


    function decode(data) {
        const iface = new ethers.utils.Interface(abi)
        const result = iface.decodeFunctionData('mint', data);
        return result;
    }
    

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
