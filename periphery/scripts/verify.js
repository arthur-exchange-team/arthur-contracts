const { run } = require("hardhat");
// const contracts = require("../contracts.json");

async function main() {
    const jobs = [
        run("verify:verify", {
            address: "0x4Ca85C1F67fe14CA2496A1eb7Cac77446a125657",
            constructorArguments: ["0xCABD78a140e869852Fd2Ef1a29c44ae575f33C77","0xbe2C5113EebFe4C083da31346534CEA1cd2bBC46"]
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
