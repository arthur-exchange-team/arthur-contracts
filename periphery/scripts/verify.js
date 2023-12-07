const { run } = require("hardhat");
// const contracts = require("../contracts.json");

async function main() {
    const jobs = [
        run("verify:verify", {
            address: "0xa6Aca3f5edE841152706D7dAa435a11c03B61eA8",
            constructorArguments: ["0xa35853A052d566F1C682724451A263f7437E9571","0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f"]
        })
    ];

    await Promise.all(jobs.map((job) => job.catch(console.log)));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
