const { ethers } = require("hardhat");
const fs = require("fs");
require("dotenv").config();
const env = process.env;

async function main() {
    //* Get network */
    const accounts = await ethers.getSigners();

    console.log("==========================================================================");
    console.log("ACCOUNTS:");
    console.log("==========================================================================");
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        console.log(` Account ${i}: ${account.address}`);
    }

    //* Loading contract factory */
    const ArthurRouter = await ethers.getContractFactory("ArthurRouter");

    //linea testnet
    // const factory = "0xf21BA8A951C2e43FC5eDF6E220D2328eA659c81C";
    // const weth = "0xbe2C5113EebFe4C083da31346534CEA1cd2bBC46";

    //linea mainnet
    const factory = "0x7f7ae0Ab3783408D30C978831e0d8d0F074a9c5D";
    const weth = "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f";

    // sepolia
    // const factory = "0x9F423958b0e02d6C60D1714a37bc627C23C7d048";
    // const weth = "0xc82f14458f68f076A4f2E756dB24B56A3C670bB4";

    // mumbai 
    // const factory = "0x943931387b8659A74752c8D7B890870899b4Fdaf";
    // const weth = "0xc82f14458f68f076A4f2E756dB24B56A3C670bB4";

    //* Deploy contracts */
    console.log("==========================================================================");
    console.log("DEPLOYING CONTRACTS");
    console.log("==========================================================================");

    const arthurRouter = await ArthurRouter.deploy(factory, weth);
    await arthurRouter.deployed();
    console.log("ArthurRouter                        deployed to:>>", arthurRouter.address);

    console.log("==========================================================================");
    console.log("VERIFY CONTRACTS");
    console.log("==========================================================================");

    await hre
        .run("verify:verify", {
            address: arthurRouter.address,
            constructorArguments: [factory, weth]
        })
        .catch(console.log);

    console.log("==========================================================================");
    console.log("DONE");
    console.log("==========================================================================");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
