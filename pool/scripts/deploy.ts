import hre from "hardhat";
import fs from "fs";
import {
	FlashpadMaster__factory,
	FlashpadMaster,
	ThunderPoolFactory__factory,
	ThunderPoolFactory,
	NFTPoolFactory__factory,
	NFTPoolFactory,
	YieldBooster__factory,
	YieldBooster,
	PositionHelper__factory,
	PositionHelper,
	FlashToken__factory,
	FlashToken,
	XFlashToken__factory,
	XFlashToken,
	DividendsV2__factory,
	DividendsV2
} from "../typechain-types";
import { parseEther } from "ethers/lib/utils";
import { getTimestamp } from "../test/utils";
const ONE_DAY = 24 * 60 * 60;

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
	const FlashpadMaster: FlashpadMaster__factory = await hre.ethers.getContractFactory("FlashpadMaster");
	const ThunderPoolFactory: ThunderPoolFactory__factory = await hre.ethers.getContractFactory("ThunderPoolFactory");
	const NFTPoolFactory: NFTPoolFactory__factory = await hre.ethers.getContractFactory("NFTPoolFactory");
	const YieldBooster: YieldBooster__factory = await hre.ethers.getContractFactory("YieldBooster");
	const PositionHelper: PositionHelper__factory = await hre.ethers.getContractFactory("PositionHelper");
	const FlashToken: FlashToken__factory = await hre.ethers.getContractFactory("FlashToken");
	const XFlashToken: XFlashToken__factory = await hre.ethers.getContractFactory("XFlashToken");
	const DividendsV2: DividendsV2__factory = await hre.ethers.getContractFactory("DividendsV2");

	//* Deploy contracts */
	console.log("================================================================================");
	console.log("DEPLOYING CONTRACTS");
	console.log("================================================================================");

	const startTime = (await getTimestamp()) + ONE_DAY;
	console.log("startTime", startTime);

	// linea
	const flashpadRouter = "0x01fEfccfF0b9E9F834B6436135cDc14FCf1f5D04";
	const weth = "0xbe2C5113EebFe4C083da31346534CEA1cd2bBC46";
	const flashpadRecovery = accounts[0].address;
	const feeAddress = accounts[0].address;
	const treasuryAddress = accounts[0].address;

	// mumbai
	// const flashpadRouter = "0x764EcF27DF3df771D1c79f48A05aB18d2b6BBa10";
	// const weth = "0xc82f14458f68f076A4f2E756dB24B56A3C670bB4";
	// const flashToken = "";
	// const xFlashToken = "";

	const flashToken = await FlashToken.deploy(parseEther("10000000"), parseEther("7250000"), "178240740740741", treasuryAddress) as FlashToken;
	await flashToken.deployed();
	console.log("FlashToken                          deployed to:>>", flashToken.address);

	const xFlashToken = await XFlashToken.deploy(flashToken.address) as XFlashToken;
	await xFlashToken.deployed();
	console.log("XFlashToken                          deployed to:>>", xFlashToken.address);

	const dividendsV2 = await DividendsV2.deploy(flashToken.address, startTime) as DividendsV2;
	await dividendsV2.deployed();
	console.log("DividendsV2                          deployed to:>>", dividendsV2.address);

	const flashpadMaster = await FlashpadMaster.deploy(flashToken.address, startTime) as FlashpadMaster;
	await flashpadMaster.deployed();
	console.log("FlashpadMaster                          deployed to:>>", flashpadMaster.address);

	const thunderPoolFactory = await ThunderPoolFactory.deploy(flashToken.address, xFlashToken.address, flashpadRecovery, feeAddress) as ThunderPoolFactory;
	await thunderPoolFactory.deployed();
	console.log("ThunderPoolFactory                          deployed to:>>", thunderPoolFactory.address);

	const nftPoolFactory = await NFTPoolFactory.deploy(flashpadMaster.address, flashToken.address, xFlashToken.address) as NFTPoolFactory;
	await nftPoolFactory.deployed();
	console.log("NFTPoolFactory                          deployed to:>>", nftPoolFactory.address);

	const yieldBooster = await YieldBooster.deploy(xFlashToken.address) as YieldBooster;
	await yieldBooster.deployed();
	console.log("YieldBooster                          deployed to:>>", yieldBooster.address);

	const positionHelper = await PositionHelper.deploy(flashpadRouter, weth) as PositionHelper;
	await positionHelper.deployed();
	console.log("PositionHelper                          deployed to:>>", positionHelper.address);

	await flashToken.updateAllocations("70");
	await flashToken.initializeEmissionStart(startTime);
	await flashToken.initializeMasterAddress(flashpadMaster.address);
	await flashpadMaster.setYieldBooster(yieldBooster.address);

	console.log("================================================================================");
	console.log("DONE");
	console.log("================================================================================");

	const contracts = {
		startTime: startTime,
		flashToken: flashToken.address,
		xFlashToken: xFlashToken.address,
		dividendsV2: dividendsV2.address,
		flashpadMaster: flashpadMaster.address,
		thunderPoolFactory: thunderPoolFactory.address,
		nftPoolFactory: nftPoolFactory.address,
		yieldBooster: yieldBooster.address,
		positionHelper: positionHelper.address
	};

	await fs.writeFileSync("contracts.json", JSON.stringify(contracts));

	const contractVerify = {
		startTime: startTime,
		flashToken: flashToken.address,
		xFlashToken: xFlashToken.address,
		dividendsV2: dividendsV2.address,
		flashpadMaster: flashpadMaster.address,
		thunderPoolFactory: thunderPoolFactory.address,
		nftPoolFactory: nftPoolFactory.address,
		yieldBooster: yieldBooster.address,
		positionHelper: positionHelper.address
	};

	await fs.writeFileSync("contracts-verify.json", JSON.stringify(contractVerify));

	await hre
		.run("verify:verify", {
			address: flashToken.address,
			constructorArguments: [parseEther("10000000"), parseEther("7250000"), "178240740740741", treasuryAddress]
		})
		.catch(console.log);

	await hre
		.run("verify:verify", {
			address: xFlashToken.address,
			constructorArguments: [flashToken.address]
		})
		.catch(console.log);

	await hre
		.run("verify:verify", {
			address: dividendsV2.address,
			constructorArguments: [flashToken.address, startTime]
		})
		.catch(console.log);

	await hre
		.run("verify:verify", {
			address: flashpadMaster.address,
			constructorArguments: [flashToken.address, startTime]
		})
		.catch(console.log);

	await hre
		.run("verify:verify", {
			address: thunderPoolFactory.address,
			constructorArguments: [flashToken.address, xFlashToken.address, flashpadRecovery, feeAddress]
		})
		.catch(console.log);

	await hre
		.run("verify:verify", {
			address: nftPoolFactory.address,
			constructorArguments: [flashpadMaster.address, flashToken.address, xFlashToken.address]
		})
		.catch(console.log);

	await hre
		.run("verify:verify", {
			address: yieldBooster.address,
			constructorArguments: [xFlashToken.address]
		})
		.catch(console.log);

	await hre
		.run("verify:verify", {
			address: positionHelper.address,
			constructorArguments: [flashpadRouter, weth]
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
