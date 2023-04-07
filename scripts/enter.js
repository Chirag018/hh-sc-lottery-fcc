const { ethers } = require("hardhat")

async function enterRaffle() {
    const raffle = await ethers.getEntranceFee();
    const entranceFee = await raffle.getEntranceFee();
    await raffle.enterRaffle({ value: entranceFee + 1 })
    console.log('entered!');
}

enterRaffle()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1)
    })