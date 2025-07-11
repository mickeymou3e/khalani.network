pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "../script/lib/LibDiamondDeployer.sol";
import "../src/InterchainMessaging/adapters/HyperlaneAdapter.sol";
import "../src/Tokens/ERC20MintableBurnable.sol";
import "../src/LiquidityReserves/remote/AssetReserves.sol";
import "@hyperlane-xyz/core/contracts/mock/MockMailbox.sol";
import "@hyperlane-xyz/core/contracts/test/TestMultisigIsm.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/LiquidityReserves/khalani/LiquidityProjector.sol";
import "./Mock/MockKhalaniReceiver.sol";
import "../src/LiquidityReserves/khalani/kln/LiquidityAggregator.sol";
import "../src/LiquidityReserves/khalani/kai/KaiLiquidityAggregator.sol";
import "../src/InterchainLiquidityHub/InterchainLiquidityHubWrapper.sol";
import "./Mock/MockBalancerVault.sol";
import "../src/InterchainMessaging/gasPayment/GasPaymaster.sol";
import "./Mock/MockIgp.sol";

contract BridgeFacetTest is Test {
    //------------------------REMOTE--CHAIN ID 1------------------------//
    address interChainGateway1;
    address hyperlaneAdapter1;
    address assetReserves1;
    address mailbox1;
    // tokens on remote chain
    address usdc1;
    address kai1;

    //------------------------KHALANI--CHAIN ID 2------------------------//
    address interChainGateway2;
    address mailbox2;
    address hyperlaneAdapter2;
    address liquidityProjector;
    address liquidityAggregator;
    address kaiLiquidityAggregator;
    address interchainLiquidityHub;
    // mirror token ans kai on khalani chain
    address usdcMirror1; // mirror token for chain 1
    address kaiKhalani;
    address usdcMirror3; // mirror token for chain 3
    // klnUsdc on khalani chain (Khalani USDC)
    address klnUsdc;
    address vault;
    address bpt;

    //------------------------REMOTE--CHAIN ID 3------------------------//
    address interChainGateway3;
    address hyperlaneAdapter3;
    address assetReserves3;
    address mailbox3;
    // tokens on remote chain
    address usdc3;
    address kai3;

    uint constant public DEFAULT_GAS_OVERHEAD = 100_000;

    function setUp() public {
        interChainGateway1 = LibDiamondDeployer.deployDiamond(address(this));
        LibDiamondDeployer.addRemoteChainFacets(interChainGateway1);

        interChainGateway2 = LibDiamondDeployer.deployDiamond((address(this)));
        LibDiamondDeployer.addKhalaniFacets(interChainGateway2);

        interChainGateway3 = LibDiamondDeployer.deployDiamond(address(this));
        LibDiamondDeployer.addRemoteChainFacets(interChainGateway3);

        (mailbox1, hyperlaneAdapter1) = deployHyperlaneAdapter(
            1,
            interChainGateway1
        );
        (mailbox2, hyperlaneAdapter2) = deployHyperlaneAdapter(
            2,
            interChainGateway2
        );
        (mailbox3, hyperlaneAdapter3) = deployHyperlaneAdapter(
            3,
            interChainGateway3
        );
        registerRemoteAdapter();

        deployAssets();
        deployAssetReserves();
        deployLiquidityProjector();
        deployIlhWrapper();

        deployLiquidityAggregator();

        initialiseRemoteDiamond();
        initialiseKhalaniDiamond();
    }

    //------------------------TESTS------------------------//
    function test_RemoteToKhalani(uint256 amount) public {
        //mint both kai and usdc on remote chain to users
        address user = getUserWithTokens(amount);
        // deposit kai assetProjector
        IERC20MintableBurnable(kaiKhalani).mint(liquidityProjector, amount);

        //prepare request parameters for send function
        uint256 destination = 2;
        Token[] memory tokens = new Token[](2);
        tokens[0] = Token(kai1, amount);
        tokens[1] = Token(usdc1, amount);

        // add even check
        assertEq(ERC20(usdc1).balanceOf(user), amount); // assert user's usdc balance
        assertEq(ERC20(kai1).balanceOf(user), amount); // assert user's kai balance
        assertEq(ERC20(kai1).totalSupply(), amount); // assert total supply of kai
        assertEq(ERC20(usdc1).balanceOf(assetReserves1), 0); // assert assetReserves1 usdc balance

        uint256 value = _toPayForGas(destination, tokens.length, hyperlaneAdapter1);

        vm.startPrank(user);
        vm.expectEmit(interChainGateway1);
        emit RemoteBridgeRequest(user, destination, tokens, user);
        RemoteBridgeFacet(interChainGateway1).send{value : value}(
            destination,
            tokens,
            "",
            true,
            user,
            ""
        );
        vm.stopPrank();
        assertEq(ERC20(usdc1).balanceOf(user), 0); // assert user's usdc balance
        assertEq(ERC20(kai1).balanceOf(user), 0); // assert user's kai balance
        assertEq(ERC20(usdc1).balanceOf(assetReserves1), amount); // assert assetReserves1 usdc balance
        assertEq(ERC20(kai1).totalSupply(), 0); // assert total supply of kai

        // process hyperlane cross-chain relay
        vm.chainId(destination);
        MockMailbox(mailbox2).processNextInboundMessage();

        assertEq(ERC20(klnUsdc).balanceOf(user), amount); // assert user's usdc balance on Khalani chain
        assertEq(ERC20(kaiKhalani).balanceOf(user), amount); // assert user's kai balance on khalani chain
        assertEq(ERC20(usdcMirror1).balanceOf(liquidityAggregator), amount); // assert liquidity aggregator's usdc balance
        assertEq(ERC20(kaiKhalani).totalSupply(), amount); // assert total supply of kaiKhalani
        assertEq(ERC20(usdcMirror1).totalSupply(), amount); // assert total supply of usdcMirror
        assertEq(ERC20(klnUsdc).totalSupply(), amount); // assert total supply of klnUsdc
    }

    function test_remoteToKhalani_withTargetContract(int256 amountInt) public {
        uint amount = uint(bound(amountInt, 1, type(int256).max));
        //mint both kai and usdc on remote chain to users
        address user = getUserWithTokens(amount);
        // deposit kai assetProjector
        IERC20MintableBurnable(kaiKhalani).mint(liquidityProjector, amount);
        //deploy a target contract with IMessageReceiver interface
        address target = address(new MockKhalaniReceiver());
        bytes memory message = abi.encode("hello world");

        //prepare request parameters for send function
        uint256 destination = 2;
        Token[] memory tokens = new Token[](2);
        tokens[0] = Token(kai1, amount);
        tokens[1] = Token(usdc1, amount);

        // add even check
        assertEq(ERC20(usdc1).balanceOf(user), amount); // assert user's usdc balance
        assertEq(ERC20(kai1).balanceOf(user), amount); // assert user's kai balance
        assertEq(ERC20(kai1).totalSupply(), amount); // assert total supply of kai
        assertEq(ERC20(usdc1).balanceOf(assetReserves1), 0); // assert assetReserves1 usdc balance

        uint256 value = _toPayForGas(block.chainid, tokens.length, hyperlaneAdapter1);

        vm.startPrank(user);
        vm.expectEmit(interChainGateway1);
        emit RemoteBridgeRequest(user, destination, tokens, target);
        RemoteBridgeFacet(interChainGateway1).send{value : value}(
            destination,
            tokens,
            "",
            true,
            target,
            message
        );
        vm.stopPrank();

        assertEq(ERC20(usdc1).balanceOf(user), 0); // assert user's usdc balance
        assertEq(ERC20(kai1).balanceOf(user), 0); // assert user's kai balance
        assertEq(ERC20(usdc1).balanceOf(assetReserves1), amount); // assert assetReserves1 usdc balance
        assertEq(ERC20(kai1).totalSupply(), 0); // assert total supply of kai

        // process hyperlane cross-chain relay
        vm.chainId(destination);
        vm.expectEmit(interChainGateway2);
        emit MessageProcessed(1, user, tokens, 2, target);
        MockMailbox(mailbox2).processNextInboundMessage();

        assertEq(ERC20(klnUsdc).balanceOf(target), amount); // assert user's usdc balance on Khalani chain
        assertEq(ERC20(kaiKhalani).balanceOf(target), amount); // assert user's kai balance on khalani chain
        assertEq(ERC20(usdcMirror1).balanceOf(liquidityAggregator), amount); // assert liquidity aggregator's usdc balance
        assertEq(ERC20(kaiKhalani).totalSupply(), amount); // assert total supply of kaiKhalani
        assertEq(ERC20(usdcMirror1).totalSupply(), amount); // assert total supply of usdcMirror
        assertEq(ERC20(klnUsdc).totalSupply(), amount); // assert total supply of klnUsdc
    }

    // Add Liquidity to usdc.eth/klnusdc pool and receive bpt
    function test_remoteToKhalani_withSwaps(int256 amountInt) public {
        uint amount = uint(bound(amountInt, 1, type(int256).max));
        //mint both kai and usdc on remote chain to users
        address user = getUserWithTokens(amount);
        // deposit kai assetProjector
        IERC20MintableBurnable(kaiKhalani).mint(liquidityProjector, amount);

        uint256 destination = 2;
        Token[] memory tokens = new Token[](1);
        tokens[0] = Token(usdc1, amount);

        assertEq(ERC20(usdc1).balanceOf(user), amount); // assert user's usdc balance
        assertEq(ERC20(usdc1).balanceOf(assetReserves1), 0); // assert assetReserves1 usdc balance

        bytes memory swapData = prepareSwapDataForCCLPLiquidityProvision(
            amount
        );

        uint256 value = _toPayForGas(block.chainid, tokens.length, hyperlaneAdapter1);
        vm.startPrank(user);
        vm.expectEmit(interChainGateway1);
        emit RemoteBridgeRequest(user, destination, tokens, user);
        RemoteBridgeFacet(interChainGateway1).send{value : value}(
            destination,
            tokens,
            swapData,
            false,
            user,
            ""
        );
        vm.stopPrank();
        //should have 0 allowance
        assertEq(
            ERC20(usdcMirror1).allowance(
                interChainGateway2,
                interchainLiquidityHub
            ),
            0
        ); //check allowance for interchainLiquidityHub for usdcMirror

        // process hyperlane cross-chain relay
        vm.chainId(2);
        vm.expectEmit(interChainGateway2);
        emit MessageProcessed(1, user, tokens, destination, user);
        MockMailbox(mailbox2).processNextInboundMessage();

        assertEq(ERC20(bpt).balanceOf(user), amount); // assert user's bpt balance
    }

    // Bridge usdc from chain_id 1 to chain_id 3 (in usdc1 , out usdc3)
    function test_remoteToRemote_withSwaps(int256 amountInt) public {
        uint amount = uint(bound(amountInt, 1, type(int256).max));
        deal(usdcMirror3, vault, amount);
        deal(usdc3, assetReserves3, amount);
        //mint both kai and usdc on remote chain to users
        address user = getUserWithTokens(amount);
        // deposit kai assetProjector
        IERC20MintableBurnable(kaiKhalani).mint(liquidityProjector, amount);

        uint256 destination = 3;
        Token[] memory tokens = new Token[](1);
        tokens[0] = Token(usdc1, amount);

        assertEq(ERC20(usdc1).balanceOf(user), amount); // assert user's usdc balance
        assertEq(ERC20(usdc1).balanceOf(assetReserves1), 0); // assert assetReserves1 usdc balance

        bytes memory swapData = prepareSwapDataForCCLPAssetBridge(amount);

        //relayer gas calc
        uint256 value = _toPayForGas(destination, tokens.length, hyperlaneAdapter1);
        vm.prank(user);
        vm.expectEmit(interChainGateway1);
        emit RemoteBridgeRequest(user, destination, tokens, user);
        RemoteBridgeFacet(interChainGateway1).send{value : value}(
            destination,
            tokens,
            swapData,
            false,
            user,
            ""
        );

        //should have 0 allowance
        assertEq(
            ERC20(usdcMirror1).allowance(
                interChainGateway2,
                interchainLiquidityHub
            ),
            0
        ); //check allowance for interchainLiquidityHub for usdcMirror
        assertEq(ERC20(usdcMirror3).balanceOf(vault), amount); //USDCMirror 3 should exist in vault

        //the diamond on khalani chain should be funded
        deal(interChainGateway2, 100e18);
        // process hyperlane cross-chain relay
        vm.chainId(2);
        vm.expectEmit(interChainGateway2);
        emit MessageProcessed(1, user, tokens, destination, user);
        tokens[0] = Token(usdcMirror3, amount);
        vm.expectEmit(interChainGateway2);
        emit BridgeRequest(interChainGateway2, 3, tokens, user);
        MockMailbox(mailbox2).processNextInboundMessage();

        assertEq(ERC20(usdcMirror1).balanceOf(vault), amount); //USDCMirror 1 should be deposited in vault
        assertEq(ERC20(usdcMirror3).balanceOf(vault), 0); //USDCMirror 3 should be out of the vault


        // process hyperlane cross-chain relay
        vm.chainId(3);
        Token[] memory expectedOutToken = new Token[](1);
        expectedOutToken[0] = Token(usdc3, amount);
        vm.expectEmit(interChainGateway3);
        emit MessageProcessed(1, user, expectedOutToken, destination, user);
        MockMailbox(mailbox3).processNextInboundMessage();

        assertEq(ERC20(usdc3).balanceOf(assetReserves3), 0); //USDC in chain 3 should be out of the assetReserves
        assertEq(ERC20(usdc3).balanceOf(user), amount); //USDC in chain 3 should be unlocked to user
    }

    //Withdraw Liquidity
    function test_KhalaniToRemote_WithSwap(int256 amountInt)public {
        uint amount = uint(bound(amountInt, 1, type( int256).max));
        address user = getUserWithTokens(amount);

        //-------preparation-------//
        //user's usdc should be locked in asset reserves of chain1
        vm.prank(user);
        IERC20(usdc1).transfer(assetReserves1, amount);
        //Lets say user added liquidity with "amount" of usdc, vault would transfer "amount" of bpt to user
        deal(usdcMirror1, vault, amount);
        vm.prank(vault);
        IERC20(bpt).transfer(user, amount);


        //now user calls wihdraw with "amount" of bpt
        bytes memory callData = prepareSwapDataForCCLPLiquidityWithdraw(amount,user);

        //on Khalani chain user makes a call to interchainLiquidityHub
        vm.chainId(2);
        vm.startPrank(user);
        // approval to interchainLiquidityHub
        IERC20(bpt).approve(interchainLiquidityHub, amount);

        //eth to pay for gas (relayer)
        uint256 value = _toPayForGas(1, 1, hyperlaneAdapter2);
        vm.expectEmit(interChainGateway2);
        Token[] memory expectedOutToken = new Token[](1);
        expectedOutToken[0] = Token(usdcMirror1, amount);
        emit BridgeRequest(interchainLiquidityHub, 1, expectedOutToken, user);
        // call to InterchainLiquidityHubWrapper.withdrawLiquidity
        (bool success, bytes memory out) = interchainLiquidityHub.call{value : value}(callData);
        vm.stopPrank();

        Token[] memory outToken = abi.decode(out, (Token[]));

        //assert

        //process cross-chain message
        vm.chainId(1);
        // expected token on chain 1 is usdc1
        expectedOutToken[0] = Token(usdc1, amount);
        vm.expectEmit(interChainGateway1);
        emit MessageProcessed(2, user, expectedOutToken, 1, user);

        // mailbox1 process
        MockMailbox(mailbox1).processNextInboundMessage();

        //assert user's usdc1 balance
        assertEq(ERC20(usdc1).balanceOf(user), amount);
    }

    //------------------------SETUP HELPERS------------------------//

    function deployHyperlaneAdapter(
        uint256 chainId,
        address interChainGateway
    ) private returns (address, address) {
        MockMailbox mailbox = new MockMailbox(uint32(chainId));
        address ism = address(new TestMultisigIsm());
        address innerIgp = address(new MockIgp());
        address igp = address(new GasPaymaster(address (innerIgp)));
        HyperlaneAdapter adapter = new HyperlaneAdapter(
            address(mailbox),
            ism,
            interChainGateway,
            igp
        );
        return (address(mailbox), address(adapter));
    }

    function registerRemoteAdapter() private {
        MockMailbox(mailbox1).addRemoteMailbox(2, MockMailbox(mailbox2));
        MockMailbox(mailbox2).addRemoteMailbox(1, MockMailbox(mailbox1));
        MockMailbox(mailbox3).addRemoteMailbox(2, MockMailbox(mailbox2));
        MockMailbox(mailbox2).addRemoteMailbox(3, MockMailbox(mailbox3));
    }

    function deployAssets() private {
        usdc1 = address(new ERC20("USDC1", "USDC1"));
        kai1 = address(new ERC20MintableBurnable("KAI1", "KAI1"));
        usdc3 = address(new ERC20("USDC3", "USDC3"));
        kai3 = address(new ERC20MintableBurnable("KAI3", "KAI3"));
        usdcMirror1 = address(
            new ERC20MintableBurnable("USDCMirror1", "USDCMirror1")
        );
        usdcMirror3 = address(
            new ERC20MintableBurnable("USDCMirror3", "USDCMirror3")
        );
        kaiKhalani = address(new ERC20MintableBurnable("KAI", "KAI"));
        klnUsdc = address(new ERC20MintableBurnable("KLNUSDC", "KLNUSDC"));
    }

    function deployAssetReserves() private {
        assetReserves1 = address(new AssetReserves(interChainGateway1, kai1));
        AssetReserves(assetReserves1).addWhiteListedAsset(usdc1);
        ERC20MintableBurnable(kai1).addMinterRole(assetReserves1);
        assetReserves3 = address(new AssetReserves(interChainGateway3, kai3));
        AssetReserves(assetReserves3).addWhiteListedAsset(usdc3);
        ERC20MintableBurnable(kai3).addMinterRole(assetReserves3);
    }

    function deployLiquidityProjector() private {
        liquidityProjector = address(
            new LiquidityProjector(interChainGateway2, kaiKhalani)
        );
        LiquidityProjector(liquidityProjector).setMirrorToken(
            1,
            usdc1,
            usdcMirror1
        );
        LiquidityProjector(liquidityProjector).setMirrorToken(
            1,
            kai1,
            kaiKhalani
        );
        LiquidityProjector(liquidityProjector).setMirrorToken(
            3,
            usdc3,
            usdcMirror3
        );
        LiquidityProjector(liquidityProjector).setMirrorToken(
            3,
            kai3,
            kaiKhalani
        );
        ERC20MintableBurnable(usdcMirror1).addMinterRole(liquidityProjector);
        ERC20MintableBurnable(usdcMirror3).addMinterRole(liquidityProjector);
        ERC20MintableBurnable(kaiKhalani).addMinterRole(liquidityProjector);
    }

    function deployLiquidityAggregator() private {
        liquidityAggregator = address(new LiquidityAggregator());
        LiquidityAggregator(liquidityAggregator).registerTokenForKlnToken(
            usdcMirror1,
            klnUsdc
        );
        LiquidityAggregator(liquidityAggregator).registerTokenForKlnToken(
            usdcMirror3,
            klnUsdc
        );
        ERC20MintableBurnable(klnUsdc).addMinterRole(liquidityAggregator);

        kaiLiquidityAggregator = address(
            new KaiLiquidityAggregator(kaiKhalani)
        );
        KaiLiquidityAggregator(kaiLiquidityAggregator).addWhiteListedAsset(
            usdcMirror1
        );
        KaiLiquidityAggregator(kaiLiquidityAggregator).addWhiteListedAsset(
            usdcMirror3
        );


    }

    function deployIlhWrapper() private {
        bpt = address(new ERC20MintableBurnable("BPT", "BPT"));
        vault = address(new MockBalancerVault(bpt));
        interchainLiquidityHub = address(
            new InterchainLiquidityHubWrapper(vault, interChainGateway2)
        );
        deal(bpt, vault, type(uint256).max);
    }

    function initialiseRemoteDiamond() private {
        RemoteSetter(interChainGateway1).initialize(
            assetReserves1,
            hyperlaneAdapter2,
            2,
            hyperlaneAdapter1
        );
        RemoteSetter(interChainGateway3).initialize(
            assetReserves3,
            hyperlaneAdapter2,
            2,
            hyperlaneAdapter3
        );
    }

    function initialiseKhalaniDiamond() private {
        KhalaniSetter(interChainGateway2).initializeRemoteRequestProcessor(
            hyperlaneAdapter2,
            liquidityProjector,
            interchainLiquidityHub,
            liquidityAggregator
        );

        KhalaniSetter(interChainGateway2).registerRemoteAdapter(
            1,
            hyperlaneAdapter1
        );
        KhalaniSetter(interChainGateway2).registerRemoteAdapter(
            3,
            hyperlaneAdapter3
        );
    }

    function getUserWithTokens(uint256 amount) internal returns (address) {
        address user = vm.addr(1);
        deal(user, 100e18);
        IERC20MintableBurnable(kai1).mint(user, amount);
        deal(usdc1, user, amount);
        deal(usdc3, assetReserves3, amount);
        vm.startPrank(user);
        IERC20(kai1).approve(assetReserves1, amount);
        IERC20(usdc1).approve(assetReserves1, amount);
        vm.stopPrank();

        return user;
    }

    function prepareSwapDataForCCLPLiquidityProvision(
        uint amount
    ) internal returns (bytes memory) {
        IAsset[] memory _assets = new IAsset[](2);
        _assets[0] = IAsset(usdcMirror1);
        _assets[1] = IAsset(bpt);

        BatchSwapStep[] memory swaps = new BatchSwapStep[](1);
        swaps[0] = BatchSwapStep({
            poolId: bytes32("1"),
            assetInIndex: 0,
            assetOutIndex: 1,
            amount: amount,
            userData: bytes("")
        });

        (bytes memory encodedSwaps, uint256 swapCount) = LibEncode.encodePack(
            swaps
        );

        int256[] memory limits = MockBalancerVault(vault).queryBatchSwap(
            IVault.SwapKind.GIVEN_IN,
            swaps,
            _assets,
            FundManagement({
                sender: address(this),
                fromInternalBalance: false,
                recipient: payable(address(this)),
                toInternalBalance: false
            })
        );

        //SDK will return this
        return
            abi.encodeWithSelector(
                InterchainLiquidityHubWrapper.executeSwap.selector,
                encodedSwaps,
                swapCount,
                _assets,
                limits,
                block.timestamp
            );
    }

    function prepareSwapDataForCCLPAssetBridge(
        uint amount
    ) internal returns (bytes memory) {
        IAsset[] memory _assets = new IAsset[](3);
        _assets[0] = IAsset(usdcMirror1);
        _assets[1] = IAsset(usdcMirror3);
        _assets[2] = IAsset(klnUsdc);

        BatchSwapStep[] memory swaps = new BatchSwapStep[](2);
        swaps[0] = BatchSwapStep({
            poolId: bytes32("1"),
            assetInIndex: 0,
            assetOutIndex: 2,
            amount: amount,
            userData: bytes("")
        });
        swaps[1] = BatchSwapStep({
            poolId: bytes32("2"),
            assetInIndex: 2,
            assetOutIndex: 1,
            amount: amount,
            userData: bytes("")
        });

        (bytes memory encodedSwaps, uint256 swapCount) = LibEncode.encodePack(
            swaps
        );

        int256[] memory limits = MockBalancerVault(vault).queryBatchSwap(
            IVault.SwapKind.GIVEN_IN,
            swaps,
            _assets,
            FundManagement({
                sender: address(this),
                fromInternalBalance: false,
                recipient: payable(address(this)),
                toInternalBalance: false
            })
        );

        //SDK will return this
        return
            abi.encodeWithSelector(
                InterchainLiquidityHubWrapper.executeSwap.selector,
                encodedSwaps,
                swapCount,
                _assets,
                limits,
                block.timestamp
            );
    }

    function prepareSwapDataForCCLPLiquidityWithdraw(
        uint amount,
        address user
    ) internal returns (bytes memory) {
        //prepare calldata for InterchainLiquidityHubWrapper.withdrawLiquidity
        uint256 chainId = 1;
        address receiver = user;
        BatchSwapStep[] memory swaps = new BatchSwapStep[](1);
        swaps[0] = BatchSwapStep({
            poolId: bytes32("1"),
            assetInIndex: 0,
            assetOutIndex: 1,
            amount: amount,
            userData: bytes("")
        });
        IAsset[] memory _assets = new IAsset[](2);
        _assets[0] = IAsset(bpt);
        _assets[1] = IAsset(usdcMirror1);

        int256[] memory limits = MockBalancerVault(vault).queryBatchSwap(
            IVault.SwapKind.GIVEN_OUT,
            swaps,
            _assets,
            FundManagement({
                sender: address(this),
                fromInternalBalance: false,
                recipient: payable(address(this)),
                toInternalBalance: false
            })
        );

        return abi.encodeWithSelector(
            InterchainLiquidityHubWrapper.withdrawLiquidity.selector,
            chainId,
            receiver,
            swaps,
            _assets,
            limits,
            block.timestamp
        );
    }

    function _toPayForGas(uint256 domainId, uint256 tokenLength, address hyperlaneAdapter) internal returns (uint256) {
        return  IAdapter(hyperlaneAdapter).quoteSend(domainId, tokenLength);
    }

    event RemoteBridgeRequest(
        address indexed sender,
        uint256 indexed destinationChainId,
        Token[] approvedTokens,
        address target
    );

    event BridgeRequest(
        address indexed sender,
        uint256 indexed destinationChainId,
        Token[] approvedTokens,
        address target
    );

    event MessageProcessed(
        uint256 indexed origin,
        address indexed sender,
        Token[] tokens,
        uint destination,
        address target
    );
}
