const { ethers, network } = require("hardhat")

async function mockKeepers() {
    const raffle = await ethers.getContract("Raffle")
    const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""))
    const { upkeepNeeded } = await raffle.callStatic.checkUpkeep(checkData);
    if (upkeepNeeded) {
        const tx = await raffle.performUpkeep(checkData);
        const txReceipt = await tx.wait(1);
        const requestId = txReceipt.events[1].args.requestId
        console.log(`Perform upkeep with requestId: ${requestId}`);
        if (network.config.chainId == 31337) {
            await mockVrf(requestId, raffle);
        }
    }
    else {
        console.log('no upkeep needed!');
    }
}
async function mockVrf(requestId, raffle) {
    console.log('we on a local network ? ok lets pretend..');
    const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
    await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)
    console.log('responded!');
    const recentWinner = await raffle.getRecentWinner();
    console.log(`the winner is ${recentWinner}`);
}

mockKeepers().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
})