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

    const totalSupply = "1000000000000000000000000000";
    //* Loading contract factory */
    const ERC20 = await ethers.getContractFactory("ERC20");

    //* Deploy contracts */
    console.log("==========================================================================");
    console.log("DEPLOYING CONTRACTS");
    console.log("==========================================================================");

    const erc20 = await ERC20.deploy(totalSupply);
    await erc20.deployed();
    console.log("ERC20                        deployed to:>>", erc20.address);

    console.log("==========================================================================");
    console.log("VERIFY CONTRACTS");
    console.log("==========================================================================");

    await hre
        .run("verify:verify", {
            contract: "contracts/test/ERC20.sol:ERC20",
            address: erc20.address,
            constructorArguments: [totalSupply]
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
