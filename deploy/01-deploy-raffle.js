const { network, ethers } = require("hardhat");
const { verify } = require("../utils/verify")
const { networkConfig, developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")

const FUND_AMOUNT = ethers.utils.parseEther("1")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mocks;

    if (chainId == 31337) {
        //create vrfv2 subscription
        vrfCoordinatorV2Mocks = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mocks.address;
        const transactionResponse = await vrfCoordinatorV2Mocks.createSubscription()
        const transactionReceipt = await transactionResponse.wait();
        subscriptionId = transactionReceipt.events[0].args.subId

        await vrfCoordinatorV2Mocks.fundSubscription(subscriptionId, FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"];
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    const arguments = [vrfCoordinatorV2Address, subscriptionId, networkConfig[chainId]["gasLane"],
        networkConfig[chainId]["keepersUpdateInterval"], networkConfig[chainId]["raffleEntranceFee"], networkConfig[chainId]["callbackGasLimit"],
    ];
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })
    // Ensure the Raffle contract is a valid consumer of the VRFCoordinatorV2Mock contract.
    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mocks = await ethers.getContract("VRFCoordinatorV2Mocks");
        await vrfCoordinatorV2Mocks.addConsumer(subscriptionId, raffle.address);
    }

    //verify the deployments
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("verifying..")
        await verify(raffle.address, arguments)
    }
    log("enter lottery with command")
    const networkName = network.name == "hardhat" ? "localhost" : network.name;
    log(`yarn hardhat run scripts/enterRaffle.js --network ${networkName}`)
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "raffle"]