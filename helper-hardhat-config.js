const { ethers } = require("hardhat");

const networkConfig = {
    default: {
        name: "hardhat",
        inteval: "30",
    },
    31337: {
        name: "localhost",
        entranceFee: ethers.utils.parseEther("0.01"), // 0.01 ETH
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
        subscriptionId: "588",
        callbackGasLimit: "500000", // 500,000 gas
        interval: "30",
    },
    80001: {
        name: "mumbai",
        subscriptionId: "4057", //initially let's consider 0, will change it!
        gasLane: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
        interval: "30",
        entranceFee: ethers.utils.parseEther("0.01"),
        callbackGasLimit: "500000",
        vrfCoordinatorV2: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
    },
    1: {
        name: "mainnet",
        interval: "30",
    }
}
const developmentChains = ["hardhat", "localhost"]
const VERIFICATION_BLOCK_CONFIRMATIONS = 6
const frontEndContractFile = "../nextjs-sc-lottery-fcc/constants/contractAddresses.json";
const frontEndAbiFile = "../nextjs-sc-lottery-fcc/constants/abi.json";

module.exports = {
    networkConfig, developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS,
    frontEndContractFile, frontEndAbiFile,
}