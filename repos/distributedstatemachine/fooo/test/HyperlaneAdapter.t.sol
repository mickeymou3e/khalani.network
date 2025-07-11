pragma solidity 0.8.17;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "../src/InterchainMessaging/Errors.sol";
import "@hyperlane-xyz/core/contracts/mock/MockMailbox.sol";
import "../src/InterchainMessaging/adapters/HyperlaneAdapter.sol";
import "./Mock/MockNexus.sol";
import "@hyperlane-xyz/core/contracts/test/TestMultisigIsm.sol";
import "./Mock/MockIgp.sol";
import "../src/InterchainMessaging/gasPayment/GasPaymaster.sol";
import "../src/InterchainMessaging/gasPayment/KhalaniGasPaymaster.sol";

//unit tests for HyperlaneAdapter.sol
contract HyperlaneAdapterTest is Test {
    event ProcessRequestCalled(
        uint256 _origin,
        bytes32 _sender,
        bytes _message
    );

    MockMailbox mailboxChain1;
    address ismChain1;
    address igpChain1;
    address nexusChain1;

    MockMailbox mailboxChain2;
    address ismChain2;
    address igpChain2;
    address nexusChain2;

    uint32 constant sourceChainId = 1;
    uint32 constant khalaniChainId = 2;

    function setUp() public {
        mailboxChain1 = new MockMailbox(sourceChainId);
        mailboxChain2 = new MockMailbox(khalaniChainId);
        mailboxChain1.addRemoteMailbox(khalaniChainId, mailboxChain2);
        mailboxChain2.addRemoteMailbox(sourceChainId, mailboxChain1);
        ismChain1 = address(new TestMultisigIsm());
        ismChain2 = address(new TestMultisigIsm());

        address innerIgp1 = address(new MockIgp());
        address innerIgp2 = address(new MockIgp());

        igpChain1 = address(new GasPaymaster(innerIgp1));
        igpChain2 = address(new GasPaymaster(innerIgp2));

        nexusChain1 = address(new MockNexus());
        nexusChain2 = address(new MockNexus());
    }

    function test_relayMessage_Access() public{
        HyperlaneAdapter adapterChain1 = new HyperlaneAdapter(address(mailboxChain1), ismChain1, nexusChain1, igpChain1);
        vm.expectRevert(InvalidNexus.selector);
        adapterChain1.relayMessage(khalaniChainId, TypeCasts.addressToBytes32(address(vm.addr(3))), abi.encodePacked("Hello"));
    }

    function test_handle_Access() public{
        HyperlaneAdapter adapterChain1 = new HyperlaneAdapter(address(mailboxChain1), ismChain1, nexusChain1, igpChain1);
        vm.expectRevert(InvalidInbox.selector);
        adapterChain1.handle(sourceChainId, TypeCasts.addressToBytes32(address(vm.addr(3))), abi.encodePacked("Hello"));
    }

    function test_relayMessage_handle() public {
        HyperlaneAdapter adapterChain1 = new HyperlaneAdapter(address(mailboxChain1), ismChain1, nexusChain1, igpChain1);
        HyperlaneAdapter adapterChain2 = new HyperlaneAdapter(address(mailboxChain2), ismChain2, nexusChain2, igpChain2);

        //send message from chain 1 to chain 2
        vm.prank(nexusChain1);
        adapterChain1.relayMessage(khalaniChainId, TypeCasts.addressToBytes32(address(adapterChain2)), abi.encodePacked("Hello"));
        vm.expectEmit(nexusChain2);
        emit ProcessRequestCalled(sourceChainId, TypeCasts.addressToBytes32(address(adapterChain1)), abi.encodePacked("Hello"));
        mailboxChain2.processNextInboundMessage();
    }

    function test_payRelayer_GasPaymaster(uint256 overheadAmount, uint256 tokenMintAmount, uint256 numTokens) public {
        overheadAmount = bound(overheadAmount, 100_000, 500_000);
        tokenMintAmount = bound(tokenMintAmount, 65_000, 100_000);
        numTokens = bound(numTokens, 1, 10);
        uint256 gasPrice = 10;

        (IGasPayMaster igpEndChain,address innerIgp) = _setUpGasPaymasterEndChain(overheadAmount, tokenMintAmount);
        HyperlaneAdapter adapterChain1 = new HyperlaneAdapter(address(mailboxChain1), ismChain1, nexusChain1, address(igpEndChain));
        console.log("gas amount: %s", igpEndChain.destinationGasAmount(khalaniChainId, numTokens));
        uint256 expectedAmountToPayForGas = (overheadAmount + tokenMintAmount * numTokens) * gasPrice; // 10 is the gas price in mocked inned igp
        uint256 amountFromQuote = adapterChain1.quoteSend(khalaniChainId, numTokens);
        assertEq(amountFromQuote, expectedAmountToPayForGas);

        //create dummy message id
        bytes32 messageId = keccak256(abi.encodePacked("dummy_message_id"));

        //pay for gas
        vm.expectEmit(innerIgp);
        emit GasPayment(messageId, expectedAmountToPayForGas / gasPrice, expectedAmountToPayForGas);
        adapterChain1.payRelayer{value : amountFromQuote}(messageId, khalaniChainId, numTokens, msg.sender);

        //try making less payment
        vm.expectRevert("insufficient interchain gas payment");
        adapterChain1.payRelayer{value : amountFromQuote - 1}(messageId, khalaniChainId, numTokens, msg.sender);
    }

    function test_payRelayer_KhalaniGasPaymaster(uint256 overheadAmount, uint256 tokenMintAmount, uint256 numTokens) public {
        overheadAmount = bound(overheadAmount, 100_000, 500_000);
        tokenMintAmount = bound(tokenMintAmount, 65_000, 100_000);
        numTokens = bound(numTokens, 1, 10);

        IGasPayMaster khalaniGasPaymaster = setupGasPaymasterKhalaniChain(overheadAmount, tokenMintAmount);
        HyperlaneAdapter adapterChain2 = new HyperlaneAdapter(address(mailboxChain2), ismChain2, nexusChain2, address(khalaniGasPaymaster));
        console.log("gas amount: %s", khalaniGasPaymaster.destinationGasAmount(sourceChainId, numTokens));
        uint256 expectedAmountToPayForGas = overheadAmount + tokenMintAmount * numTokens;
        uint256 amountFromQuote = adapterChain2.quoteSend(sourceChainId, numTokens);
        assertEq(amountFromQuote, expectedAmountToPayForGas);

        //create dummy message id
        bytes32 messageId = keccak256(abi.encodePacked("dummy_message_id"));

        //pay for gas
        vm.expectEmit(address (khalaniGasPaymaster));
        emit GasPayment(messageId, expectedAmountToPayForGas, expectedAmountToPayForGas);
        adapterChain2.payRelayer{value : amountFromQuote}(messageId, sourceChainId, numTokens, msg.sender);
    }

    function _setUpGasPaymasterEndChain(uint256 overheadAmount, uint256 tokenMintAmount) private returns (IGasPayMaster igpEndChain, address innerIgp){
        innerIgp = address(new MockIgp());
        igpEndChain = IGasPayMaster(address (new GasPaymaster(innerIgp)));
        igpEndChain.setDestinationGasOverhead(khalaniChainId, overheadAmount);
        igpEndChain.setUnitTokenGasOverhead(tokenMintAmount);
    }

    function setupGasPaymasterKhalaniChain(uint256 overheadAmount, uint256 tokenMintAmount) private returns (IGasPayMaster ipgKhalaniChain){
        ipgKhalaniChain = IGasPayMaster(address (new KhalaniGasPaymaster()));
        ipgKhalaniChain.setDestinationGasOverhead(sourceChainId, overheadAmount);
        ipgKhalaniChain.setUnitTokenGasOverhead(tokenMintAmount);
    }

    //----event----//
    event GasPayment(
        bytes32 indexed messageId,
        uint256 gasAmount,
        uint256 payment
    );
}