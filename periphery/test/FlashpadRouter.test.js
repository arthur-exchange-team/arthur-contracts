const { expect } = require('chai');
const { ethers } = require('hardhat');
const contractJson = require('excalibur-core/artifacts/contracts/FlashpadFactory.sol/FlashpadFactory.json');
const FlashpadPairJson = require('excalibur-core/artifacts/contracts/FlashpadPair.sol/FlashpadPair.json');
const { getCurrentTimestamp, skipTime } = require('./utils');

ONE_DAY = 1 * 24 * 60 * 60;
ONE_ETHER = ethers.utils.parseEther('1');
ETHER_100M = ethers.utils.parseEther('100000000');
ETHER_100K = ethers.utils.parseEther('100000');

MAX_UINT256 = ethers.constants.MaxUint256;

describe('FlashpadRouter', () => {
    beforeEach(async () => {
        const accounts = await ethers.getSigners();
        owner = accounts[0];
        user1 = accounts[1];
        user2 = accounts[2];
        user3 = accounts[3];

        const ERC20 = await ethers.getContractFactory('ERC20');

        const FlashpadFactory = new ethers.ContractFactory(contractJson.abi, contractJson.bytecode, owner);
        FlashpadPair = new ethers.ContractFactory(FlashpadPairJson.abi, FlashpadPairJson.bytecode, owner);
        const WETH9 = await ethers.getContractFactory('WETH9');
        const FlashpadRouter = await ethers.getContractFactory('FlashpadRouter');

        flashpadFactory = await FlashpadFactory.deploy(owner.address);
        await flashpadFactory.deployed();

        tokenA = await ERC20.deploy(ETHER_100M);
        await tokenA.deployed();

        tokenB = await ERC20.deploy(ETHER_100M);
        await tokenB.deployed();

        weth9 = await WETH9.deploy();
        await weth9.deployed();

        flashpadRouter = await FlashpadRouter.deploy(flashpadFactory.address, weth9.address);
        await flashpadRouter.deployed();

        await tokenA.approve(flashpadRouter.address, ETHER_100M);
        await tokenB.approve(flashpadRouter.address, ETHER_100M);
    });

    describe('addLiquidity', async () => {
        it('should return successfully', async () => {
            const currentTimestamp = await getCurrentTimestamp();
            await flashpadFactory.createPair(tokenA.address, tokenB.address, ONE_DAY, currentTimestamp + ONE_DAY);
            await flashpadRouter.addLiquidity(tokenA.address, tokenB.address, ETHER_100K, ETHER_100K.div(2), ETHER_100K, ETHER_100K.div(2), owner.address, currentTimestamp + ONE_DAY, ONE_DAY, currentTimestamp + ONE_DAY);
        });

        it('check lock time', async () => {
            let currentTimestamp = await getCurrentTimestamp();
            await flashpadFactory.createPair(tokenA.address, tokenB.address, ONE_DAY, currentTimestamp + ONE_DAY);
            await flashpadRouter.addLiquidity(tokenA.address, tokenB.address, ETHER_100K, ETHER_100K.div(2), ETHER_100K, ETHER_100K.div(2), owner.address, currentTimestamp + ONE_DAY, ONE_DAY, currentTimestamp + ONE_DAY);
            await expect(flashpadRouter.removeLiquidity(tokenA.address, tokenB.address, 1, 0, 0, owner.address, currentTimestamp + ONE_DAY)).to.be.revertedWith("INVALID_TIME_LOCK");

            await skipTime(ONE_DAY + 1);
            currentTimestamp = await getCurrentTimestamp();

            const pair = await flashpadRouter.getPair(tokenA.address, tokenB.address);
            const flashpadPair = await FlashpadPair.attach(pair);

            const lpAmount = await flashpadPair.balanceOf(owner.address);
            await flashpadPair.approve(flashpadRouter.address, lpAmount);
            await flashpadRouter.removeLiquidity(tokenA.address, tokenB.address, lpAmount, 0, 0, owner.address, currentTimestamp + ONE_DAY);
        });

        it('check start time', async () => {
            let currentTimestamp = await getCurrentTimestamp();
            await flashpadFactory.createPair(tokenA.address, tokenB.address, ONE_DAY, currentTimestamp + ONE_DAY);
            await flashpadRouter.addLiquidity(tokenA.address, tokenB.address, ETHER_100K, ETHER_100K.div(2), ETHER_100K, ETHER_100K.div(2), owner.address, currentTimestamp + ONE_DAY, ONE_DAY, currentTimestamp + ONE_DAY);
            await expect(flashpadRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(ONE_ETHER, 0, [tokenA.address, tokenB.address], owner.address, ethers.constants.AddressZero, currentTimestamp + ONE_DAY)).to.be.revertedWith("INVALID_TIME");
            
            await skipTime(ONE_DAY + 1);
            currentTimestamp = await getCurrentTimestamp();
            await flashpadRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(ONE_ETHER, 0, [tokenA.address, tokenB.address], owner.address, ethers.constants.AddressZero, currentTimestamp + ONE_DAY);
        });
    });
});
