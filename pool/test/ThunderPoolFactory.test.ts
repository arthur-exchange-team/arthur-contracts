import { expect } from "chai";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { upgrades, ethers } from "hardhat";
import { ZERO_ADDRESS as AddressZero, MAX_UINT256 as MaxUint256, BN, ZERO_ADDRESS, getTimestamp } from "./utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import FlashpadFactoryJson from "../../core/artifacts/contracts/FlashpadFactory.sol/FlashpadFactory.json";
import FlashpadRouterJson from "../../periphery/artifacts/contracts/FlashpadRouter.sol/FlashpadRouter.json";
import WETH9Json from "./abi/WETH9.json";
import ERC20Json from "./abi/ERC20.json";
import {
    FlashpadMaster__factory,
    FlashpadMaster,
    ThunderPoolFactory__factory,
    ThunderPoolFactory,
    NFTPoolFactory__factory,
    NFTPoolFactory,
    YieldBooster__factory,
    YieldBooster,
    FlashToken__factory,
    FlashToken,
    XFlashToken__factory,
    XFlashToken,
    PositionHelper__factory,
    PositionHelper,
} from "../typechain-types";
import bigDecimal from "js-big-decimal";
import { BigNumber } from "ethers";

// signer variables
let owner: SignerWithAddress;
let admin1: SignerWithAddress;
let admin2: SignerWithAddress;
let user1: SignerWithAddress;
let accounts: SignerWithAddress[];

// contract instance
let positionHelper: PositionHelper;
let tokenA: any;
let tokenB: any;
let flashpadFactory: any;
let weth9: any;
let flashpadRouter: any;
let nftPoolFactory: NFTPoolFactory;

const ONE_DAY = 1 * 24 * 60 * 60;
const ONE_ETHER = ethers.utils.parseEther('1');
const ETHER_100M = ethers.utils.parseEther('100000000');
const ETHER_100K = ethers.utils.parseEther('100000');

const MAX_UINT256 = ethers.constants.MaxUint256;

describe("ThunderPoolFactory", () => {
    beforeEach(async () => {
        [owner, admin1, admin2, user1, ...accounts] = await ethers.getSigners();

        const FlashpadMaster: FlashpadMaster__factory = await ethers.getContractFactory("FlashpadMaster");
        const FlashToken: FlashToken__factory = await ethers.getContractFactory("FlashToken");
        const XFlashToken: XFlashToken__factory = await ethers.getContractFactory("XFlashToken");
        const NFTPoolFactory: NFTPoolFactory__factory = await ethers.getContractFactory("NFTPoolFactory");

        const FlashpadFactory = new ethers.ContractFactory(FlashpadFactoryJson.abi, FlashpadFactoryJson.bytecode, owner);
        const FlashpadRouter = new ethers.ContractFactory(FlashpadRouterJson.abi, FlashpadRouterJson.bytecode, owner);
        const WETH9 = new ethers.ContractFactory(WETH9Json.abi, WETH9Json.bytecode, owner);
        const ERC20 = new ethers.ContractFactory(ERC20Json.abi, ERC20Json.bytecode, owner);

        tokenA = await ERC20.deploy(ETHER_100M);
        await tokenA.deployed();

        tokenB = await ERC20.deploy(ETHER_100M);
        await tokenB.deployed();

        flashpadFactory = await FlashpadFactory.deploy(owner.address);
        await flashpadFactory.deployed();

        weth9 = await WETH9.deploy();
        await weth9.deployed();

        flashpadRouter = await FlashpadRouter.deploy(flashpadFactory.address, weth9.address);
        await flashpadRouter.deployed();

        const PositionHelper: PositionHelper__factory = await ethers.getContractFactory("PositionHelper");
        positionHelper = (await PositionHelper.deploy(flashpadRouter.address, weth9.address)) as PositionHelper;

        await tokenA.approve(flashpadRouter.address, ETHER_100M);
        await tokenB.approve(flashpadRouter.address, ETHER_100M);

        await tokenA.approve(positionHelper.address, ETHER_100M);
        await tokenB.approve(positionHelper.address, ETHER_100M);

        //=======================================================
        const currentTimestamp = await getTimestamp();
        const flashToken = await FlashToken.deploy(parseEther("10000000"), parseEther("7250000"), "178240740740741", accounts[0].address) as FlashToken;
        await flashToken.deployed();

        const xFlashToken = await XFlashToken.deploy(flashToken.address) as XFlashToken;
        await xFlashToken.deployed();

        const flashpadMaster = await FlashpadMaster.deploy(flashToken.address, currentTimestamp + ONE_DAY) as FlashpadMaster;
        await flashpadMaster.deployed();

        nftPoolFactory = await NFTPoolFactory.deploy(flashpadMaster.address, flashToken.address, xFlashToken.address) as NFTPoolFactory;
        await nftPoolFactory.deployed();
    });

    describe("addLiquidityAndCreatePosition", () => {
        it('should return successfully', async () => {
            const currentTimestamp = await getTimestamp();
            await flashpadFactory.createPair(tokenA.address, tokenB.address, ONE_DAY, currentTimestamp + ONE_DAY);
            const lp = await flashpadRouter.getPair(tokenA.address, tokenB.address);
            await nftPoolFactory.createPool(lp);
            const nftPool = await nftPoolFactory.getPool(lp);
            await positionHelper.addLiquidityAndCreatePosition(tokenA.address, tokenB.address, ETHER_100K, ETHER_100K.div(2),
                ETHER_100K, ETHER_100K.div(2), currentTimestamp + ONE_DAY, owner.address, nftPool, ONE_DAY * 183, ONE_DAY, currentTimestamp + ONE_DAY);
        });
    });
});
