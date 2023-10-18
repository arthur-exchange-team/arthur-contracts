const { run } = require("hardhat");
// const contracts = require("../contracts.json");

async function main() {
    const jobs = [
        run("verify:verify", {
            address: "0x764EcF27DF3df771D1c79f48A05aB18d2b6BBa10",
            constructorArguments: ["0x943931387b8659A74752c8D7B890870899b4Fdaf","0xc82f14458f68f076A4f2E756dB24B56A3C670bB4"]
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
