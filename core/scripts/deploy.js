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
    const FlashpadFactory = await ethers.getContractFactory("FlashpadFactory");
    const ProtocolEarnings = await ethers.getContractFactory("ProtocolEarnings");
    const dividendsWallet = "0x7029C1cD3C6C4B6ACC1967465E6a4187E733A202";
    const buybackAndBurnWallet = "0xe1e7B1257C5E914F90C838Bb1c92a3ac6ED74887";
    const operatingFundsWallet = "0x698bFE93375431A576d690E6Fa72dEE8181d966d";

    //* Deploy contracts */
    console.log("==========================================================================");
    console.log("DEPLOYING CONTRACTS");
    console.log("==========================================================================");

    // const protocolEarnings = await ProtocolEarnings.attach("0x9C50E2dC5AAFDa51B7739075368E14413a908Ebf");

    const protocolEarnings = await ProtocolEarnings.deploy(dividendsWallet, buybackAndBurnWallet, operatingFundsWallet);
    await protocolEarnings.deployed();
    console.log("ProtocolEarnings                          deployed to:>>", protocolEarnings.address);

    const flashpadFactory = await FlashpadFactory.deploy(protocolEarnings.address);
    await flashpadFactory.deployed();
    console.log("FlashpadFactory                        deployed to:>>", flashpadFactory.address);

    await flashpadFactory.setOwnerFeeShare("40000");

    console.log("==========================================================================");
    console.log("VERIFY CONTRACTS");
    console.log("==========================================================================");

    const contracts = {
        protocolEarnings: protocolEarnings.address,
        flashpadFactory: flashpadFactory.address
    };

    await fs.writeFileSync("contracts.json", JSON.stringify(contracts));

    const contractVerify = {
        protocolEarnings: protocolEarnings.address,
        flashpadFactory: flashpadFactory.address
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
            address: flashpadFactory.address,
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
