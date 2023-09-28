require ("@nomiclabs/hardhat-ethers");
const dotenv = require ("dotenv");
dotenv.config();


module.exports = {
  defaultNetwork: "goerli",
  networks: {
    mainnet: {
      url: process.env.MAINNET_URL || "",
      accounts:
        [process.env.MAINNET_PRIVATE_KEY] // dev deployer
    },
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts:
        [process.env.GOERLI_PRIVATE_KEY] // dev deployer
    },
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
}
