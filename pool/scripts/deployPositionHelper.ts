import hre from "hardhat";
import {
	PositionHelper__factory,
	PositionHelper
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
	const PositionHelper: PositionHelper__factory = await hre.ethers.getContractFactory("PositionHelper");

	//* Deploy contracts */
	console.log("================================================================================");
	console.log("DEPLOYING CONTRACTS");
	console.log("================================================================================");

	// linea
	const arthurRouter = "0x5dcC77799aA55207c3A69D63FfB706463cd834B8";
	const weth = "0xbe2C5113EebFe4C083da31346534CEA1cd2bBC46";

	// mumbai
	// const arthurRouter = "0x764EcF27DF3df771D1c79f48A05aB18d2b6BBa10";
	// const weth = "0xc82f14458f68f076A4f2E756dB24B56A3C670bB4";
	const positionHelper = await PositionHelper.deploy(arthurRouter, weth) as PositionHelper;
	await positionHelper.deployed();
	console.log("PositionHelper                          deployed to:>>", positionHelper.address);

	console.log("================================================================================");
	console.log("DONE");
	console.log("================================================================================");

	await hre
		.run("verify:verify", {
			address: positionHelper.address,
			constructorArguments: [arthurRouter, weth]
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
