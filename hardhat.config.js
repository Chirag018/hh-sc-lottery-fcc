require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()


const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MUMBAISCAN_API_KEY = process.env.MUMBAISCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmation: 1,
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80001,
      blockConfirmation: 6,
    }
  },
  // etherscan: {
  //   apiKey: {
  //     mumbai: MUMBAISCAN_API_KEY,
  //   },
  // },
  solidity: "0.8.7",
  etherscan: {
    apiKey: MUMBAISCAN_API_KEY,
  },
  mocha: {
    timeout: 500000,
  }
};
