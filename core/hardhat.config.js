// Loading env configs for deploying and public contract source
require("dotenv").config();

// Solidity compile
require("solidity-coverage");

require("hardhat-contract-sizer");

// Using hardhat-ethers plugin for deploying
// See here: https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html
//           https://hardhat.org/guides/deploying.html
require("@nomiclabs/hardhat-ethers");

// Testing plugins with Waffle
// See here: https://hardhat.org/guides/waffle-testing.html
require("@nomiclabs/hardhat-waffle");

// This plugin runs solhint on the project's sources and prints the report
// See here: https://hardhat.org/plugins/nomiclabs-hardhat-solhint.html
require("@nomiclabs/hardhat-solhint");

// Verify and public source code on etherscan
require("@nomiclabs/hardhat-etherscan");

require("@openzeppelin/hardhat-upgrades");

// Report gas
// require("hardhat-gas-reporter");

// This plugin adds ways to ignore Solidity warnings
require("hardhat-ignore-warnings");

const config = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            accounts: { count: 10 },
            allowUnlimitedContractSize: false,
            blockGasLimit: 500e9,
        },
        sepolia: {
            url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts: [process.env.SYSTEM_PRIVATE_KEY],
        },
        linea_mainnet: {
            url: `${process.env.LINEA_RPC}`,
            accounts: [process.env.SYSTEM_PRIVATE_KEY],
        },
        linea_testnet: {
            url: `${process.env.LINEA_TESTNET_RPC}`,
            accounts: [process.env.SYSTEM_TEST_PRIVATE_KEY],
        },
        mumbai: {
            url: process.env.MUMBAI_RPC,
            accounts: [process.env.SYSTEM_TEST_PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: {
            lineaMainnet: process.env.LINEA_API_KEY,
            lineaTestnet: process.env.LINEA_TESTNET_API_KEY,
            sepolia: `${process.env.ETHERSCAN_API_KEY}`,
            polygonMumbai: process.env.POLYGON_API_KEY,
        },
        customChains: [
            {
                network: "lineaTestnet",
                chainId: 59140,
                urls: {
                    apiURL: "https://api-testnet.lineascan.build/api",
                    browserURL: `${process.env.LINEA_TESTNET_RPC}`
                }
            }
        ]
    },
    solidity: {
        compilers: [
            {
                version: "0.5.16",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: "0.8.16",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
        deploy: "deploy",
        deployments: "deployments",
    },
    contractSizer: {
        alphaSort: true,
        disambiguatePaths: false,
        runOnCompile: false,
        strict: true,
    },
    mocha: {
        timeout: 200000,
        useColors: true,
        reporter: "mocha-multi-reporters",
        reporterOptions: {
            configFile: "./mocha-report.json",
        },
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        token: "BNB",
        gasPrice: 30,
        coinmarketcap: process.env.COIN_MARKET_API,
    },
    exposed: { prefix: "$" },
};

module.exports = config;
