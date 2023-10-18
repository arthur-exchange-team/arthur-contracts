const { expect } = require('chai');
const { ethers } = require('hardhat');
const contractJson = require('excalibur-core/artifacts/contracts/ArthurFactory.sol/ArthurFactory.json');
const { getCurrentTimestamp } = require('./utils');

ONE_DAY = 1 * 24 * 60 * 60;
ONE_ETHER = ethers.utils.parseEther('1');
ETHER_100M = ethers.utils.parseEther('100000000');
ETHER_100K = ethers.utils.parseEther('100000');

MAX_UINT256 = ethers.constants.MaxUint256;

describe('ArthurRouter', () => {
    beforeEach(async () => {
        const accounts = await ethers.getSigners();
        owner = accounts[0];
        user1 = accounts[1];
        user2 = accounts[2];
        user3 = accounts[3];

        const ERC20 = await ethers.getContractFactory('ERC20');

        const ArthurFactory = new ethers.ContractFactory(contractJson.abi, contractJson.bytecode, owner);
        const WETH9 = await ethers.getContractFactory('WETH9');
        const ArthurRouter = await ethers.getContractFactory('ArthurRouter');

        arthurFactory = await ArthurFactory.deploy(owner.address);
        await arthurFactory.deployed();

        tokenA = await ERC20.deploy(ETHER_100M);
        await tokenA.deployed();

        tokenB = await ERC20.deploy(ETHER_100M);
        await tokenB.deployed();

        weth9 = await WETH9.deploy();
        await weth9.deployed();

        arthurRouter = await ArthurRouter.deploy(arthurFactory.address, weth9.address);
        await arthurRouter.deployed();

        await tokenA.approve(arthurRouter.address, ETHER_100M);
        await tokenB.approve(arthurRouter.address, ETHER_100M);
    });

    describe('addLiquidity', async () => {
        it('should return successfully', async () => {
            const currentTimestamp = await getCurrentTimestamp();
            await arthurFactory.createPair(tokenA.address, tokenB.address, currentTimestamp + ONE_DAY, currentTimestamp + ONE_DAY);
            await arthurRouter.addLiquidity(tokenA.address, tokenB.address, ETHER_100K, ETHER_100K.div(2), ETHER_100K, ETHER_100K.div(2), owner.address, currentTimestamp + ONE_DAY, currentTimestamp + ONE_DAY, currentTimestamp + ONE_DAY);
        });
    });
});
