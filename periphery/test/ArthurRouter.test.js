const { expect } = require('chai');
const { ethers } = require('hardhat');
const contractJson = require('excalibur-core/artifacts/contracts/ArthurFactory.sol/ArthurFactory.json');
const ArthurPairJson = require('excalibur-core/artifacts/contracts/ArthurPair.sol/ArthurPair.json');
const { getCurrentTimestamp, skipTime } = require('./utils');

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
        ArthurPair = new ethers.ContractFactory(ArthurPairJson.abi, ArthurPairJson.bytecode, owner);
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
            await arthurFactory.createPair(tokenA.address, tokenB.address, ONE_DAY, currentTimestamp + ONE_DAY);
            await arthurRouter.addLiquidity(tokenA.address, tokenB.address, ETHER_100K, ETHER_100K.div(2), ETHER_100K, ETHER_100K.div(2), owner.address, currentTimestamp + ONE_DAY, ONE_DAY, currentTimestamp + ONE_DAY);
        });

        it('check lock time', async () => {
            let currentTimestamp = await getCurrentTimestamp();
            await arthurFactory.createPair(tokenA.address, tokenB.address, ONE_DAY, currentTimestamp + ONE_DAY);
            await arthurRouter.addLiquidity(tokenA.address, tokenB.address, ETHER_100K, ETHER_100K.div(2), ETHER_100K, ETHER_100K.div(2), owner.address, currentTimestamp + ONE_DAY, ONE_DAY, currentTimestamp + ONE_DAY);
            await expect(arthurRouter.removeLiquidity(tokenA.address, tokenB.address, 1, 0, 0, owner.address, currentTimestamp + ONE_DAY)).to.be.revertedWith("INVALID_TIME_LOCK");

            await skipTime(ONE_DAY + 1);
            currentTimestamp = await getCurrentTimestamp();

            const pair = await arthurRouter.getPair(tokenA.address, tokenB.address);
            const arthurPair = await ArthurPair.attach(pair);

            const lpAmount = await arthurPair.balanceOf(owner.address);
            await arthurPair.approve(arthurRouter.address, lpAmount);
            await arthurRouter.removeLiquidity(tokenA.address, tokenB.address, lpAmount, 0, 0, owner.address, currentTimestamp + ONE_DAY);
        });

        it('check start time', async () => {
            let currentTimestamp = await getCurrentTimestamp();
            await arthurFactory.createPair(tokenA.address, tokenB.address, ONE_DAY, currentTimestamp + ONE_DAY);
            await arthurRouter.addLiquidity(tokenA.address, tokenB.address, ETHER_100K, ETHER_100K.div(2), ETHER_100K, ETHER_100K.div(2), owner.address, currentTimestamp + ONE_DAY, ONE_DAY, currentTimestamp + ONE_DAY);
            await expect(arthurRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(ONE_ETHER, 0, [tokenA.address, tokenB.address], owner.address, ethers.constants.AddressZero, currentTimestamp + ONE_DAY)).to.be.revertedWith("INVALID_TIME");
            
            await skipTime(ONE_DAY + 1);
            currentTimestamp = await getCurrentTimestamp();
            await arthurRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(ONE_ETHER, 0, [tokenA.address, tokenB.address], owner.address, ethers.constants.AddressZero, currentTimestamp + ONE_DAY);
        });
    });
});
