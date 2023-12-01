import hre from "hardhat";
import { parseEther } from "ethers/lib/utils";
import contracts from "../contracts-verify.json";

const ONE_DAY = 24 * 60 * 60;

async function main() {
  // Verify contracts
  console.log(
    "========================================================================================="
  );
  console.log("VERIFY CONTRACTS");
  console.log(
    "========================================================================================="
  );

  const flashpadRouter = "0x01fEfccfF0b9E9F834B6436135cDc14FCf1f5D04";
  const weth = "0xbe2C5113EebFe4C083da31346534CEA1cd2bBC46";

  // await hre
  //   .run("verify:verify", {
  //     address: contracts.flashToken,
  //     constructorArguments: [parseEther("10000000"), parseEther("7250000"), "178240740740741", "0xfB2b22611F716996281FB1CBA70411848DD2d864"]
  //   })
  //   .catch(console.log);

  // await hre
  //   .run("verify:verify", {
  //     address: contracts.xFlashToken,
  //     constructorArguments: [contracts.flashToken]
  //   })
  //   .catch(console.log);

  // await hre
  //   .run("verify:verify", {
  //     address: contracts.dividendsV2,
  //     constructorArguments: [contracts.flashToken, contracts.startTime]
  //   })
  //   .catch(console.log);

  // await hre
  //   .run("verify:verify", {
  //     address: contracts.launchpad,
  //     constructorArguments: [contracts.flashToken]
  //   })
  //   .catch(console.log);

  // await hre
  //   .run("verify:verify", {
  //     address: contracts.flashpadMaster,
  //     constructorArguments: [contracts.flashToken, contracts.startTime]
  //   })
  //   .catch(console.log);

  // await hre
  //   .run("verify:verify", {
  //     address: contracts.thunderPoolFactory,
  //     constructorArguments: [contracts.flashToken, contracts.xFlashToken, "0xfB2b22611F716996281FB1CBA70411848DD2d864", "0xfB2b22611F716996281FB1CBA70411848DD2d864"]
  //   })
  //   .catch(console.log);

  // await hre
  //   .run("verify:verify", {
  //     address: contracts.nftPoolFactory,
  //     constructorArguments: [contracts.flashpadMaster, contracts.flashToken, contracts.xFlashToken]
  //   })
  //   .catch(console.log);

  // await hre
  //   .run("verify:verify", {
  //     address: contracts.yieldBooster,
  //     constructorArguments: [contracts.xFlashToken]
  //   })
  //   .catch(console.log);

  // await hre
  //   .run("verify:verify", {
  //     address: contracts.positionHelper,
  //     constructorArguments: [flashpadRouter, weth]
  //   })
  //   .catch(console.log);

  // await hre
  //   .run("verify:verify", {
  //     address: contracts.flashpadMaster,
  //     constructorArguments: [contracts.flashToken, "1693202400"]
  //   })
  //   .catch(console.log);

  await hre
  .run("verify:verify", {
    address: "0x347b29EFca2f921fFc776Cdc01AF785f043368c6",
  })
  .catch(console.log);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
