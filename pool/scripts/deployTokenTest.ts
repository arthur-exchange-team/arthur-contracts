import hre from "hardhat";
import {
	TokenTest__factory,
	TokenTest
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
	const TokenTest: TokenTest__factory = await hre.ethers.getContractFactory("TokenTest");

	//* Deploy contracts */
	console.log("================================================================================");
	console.log("DEPLOYING CONTRACTS");
	console.log("================================================================================");

	const tokenTest = await TokenTest.deploy() as TokenTest;
	await tokenTest.deployed();
	console.log("TokenTest                          deployed to:>>", tokenTest.address);

	await tokenTest.mint(accounts[0].address, "1000000000000000");

	console.log("================================================================================");
	console.log("DONE");
	console.log("================================================================================");

	await hre
		.run("verify:verify", {
			address: tokenTest.address
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
