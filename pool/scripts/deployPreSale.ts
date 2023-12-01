import hre from "hardhat";
import {
	Presale__factory,
	Presale
} from "../typechain-types";

async function main() {
	//* Loading accounts */
	const accounts = await hre.ethers.getSigners();

	console.log('=====================================================================================');
	console.log('ACCOUNTS:');
	console.log('=====================================================================================');
	for (let i = 0; i < accounts.length; i++) {
		const account = accounts[i];
		console.log(` Account ${i}: ${account.address}`);
	}

	//* Loading contract factory */
	const Presale: Presale__factory = await hre.ethers.getContractFactory("Presale");

	//* Deploy contracts */
	console.log("================================================================================");
	console.log("DEPLOYING CONTRACTS");
	console.log("================================================================================");

	const presale = await Presale.deploy("0xb056CeD9d51eb4A9C366229921CAC57E8A7a17c3", "0xF34BAEc8B153E2d14DCC99F0bA9b0bB539Bbe68d", "0x347b29EFca2f921fFc776Cdc01AF785f043368c6", "0xc03Fb6348B6a3c95B1c3ad63a0b90ebBdd615110", "1699840200", "1700445000", accounts[0].address) as Presale;
	await presale.deployed();
	console.log("Presale                          deployed to:>>", presale.address);

	console.log("================================================================================");
	console.log("DONE");
	console.log("================================================================================");

	await hre
		.run("verify:verify", {
			address: presale.address,
			constructorArguments: ["0xb056CeD9d51eb4A9C366229921CAC57E8A7a17c3", "0xF34BAEc8B153E2d14DCC99F0bA9b0bB539Bbe68d", "0x347b29EFca2f921fFc776Cdc01AF785f043368c6", "0xc03Fb6348B6a3c95B1c3ad63a0b90ebBdd615110", "1699840200", "1700445000", accounts[0].address]
		})
		.catch(console.log);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
