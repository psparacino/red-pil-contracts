require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    // gnosis: {
    //   url: process.env.GNOSIS_PROVIDER_URL,
    //   accounts: [process.env.PRIVATE_KEY]
    // },
    // rinkeby: {
    //   url: process.env.RINKEBY_PROVIDER_URL,
    //   accounts: [process.env.PRIVATE_KEY]
    // }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  gasReporter: {
    enabled: true,
    coinmarketcap: '49435fa0-bcce-433b-bb09-ff593124db1e',
    currency: "DAI"
  }
};
