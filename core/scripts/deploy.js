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
    const ArthurFactory = await ethers.getContractFactory("ArthurFactory");
    const ProtocolEarnings = await ethers.getContractFactory("ProtocolEarnings");
    const dividendsWallet = accounts[0].address;
    const buybackAndBurnWallet = accounts[0].address;
    const operatingFundsWallet = accounts[0].address;

    //* Deploy contracts */
    console.log("==========================================================================");
    console.log("DEPLOYING CONTRACTS");
    console.log("==========================================================================");

    const protocolEarnings = await ProtocolEarnings.deploy(dividendsWallet, buybackAndBurnWallet, operatingFundsWallet);
    await protocolEarnings.deployed();
    console.log("ProtocolEarnings                          deployed to:>>", protocolEarnings.address);

    const arthurFactory = await ArthurFactory.deploy(protocolEarnings.address);
    await arthurFactory.deployed();
    console.log("ArthurFactory                        deployed to:>>", arthurFactory.address);

    console.log("==========================================================================");
    console.log("VERIFY CONTRACTS");
    console.log("==========================================================================");

    const contracts = {
        protocolEarnings: protocolEarnings.address,
        arthurFactory: arthurFactory.address
    };

    await fs.writeFileSync("contracts.json", JSON.stringify(contracts));

    const contractVerify = {
        protocolEarnings: protocolEarnings.address,
        arthurFactory: arthurFactory.address
    };

    await fs.writeFileSync("contracts-verify.json", JSON.stringify(contractVerify));

    await hre
        .run("verify:verify", {
            address: protocolEarnings.address,
            constructorArguments: [dividendsWallet, buybackAndBurnWallet, operatingFundsWallet]
        })
        .catch(console.log);

    await hre
        .run("verify:verify", {
            address: arthurFactory.address,
            constructorArguments: [protocolEarnings.address]
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
