import hre from "hardhat";
import {
	NFTPool,
	NFTPool__factory
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
	const NFTPool: NFTPool__factory = await hre.ethers.getContractFactory("NFTPool");

	//* Deploy contracts */
	console.log("================================================================================");
	console.log("DEPLOYING CONTRACTS");
	console.log("================================================================================");

	// linea
	const nftPool = await NFTPool.attach("0x09dc09a1a3ccc1b25db47c3b17a6c841ba167367") as NFTPool;
	const staking = await nftPool.getStakingPosition("10");
	console.log("staking", staking.toString());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
