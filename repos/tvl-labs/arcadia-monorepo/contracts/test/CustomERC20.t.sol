import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {CustomERC20} from "../src/spoke/CustomERC20.sol";
import "forge-std/Test.sol";

contract CustomERC20Test is Test {
    CustomERC20 public token;
    address public owner;
    address public user;

    function setUp() public {
        owner = address(this);
        user = address(0x1234567890);
        token = new CustomERC20("TestToken", "TTK");
        token.transferOwnership(owner);
    }

    function testMintByOwner() public {
        uint256 mintAmount = 1000 * 10 ** 18;
        token.mint(user, mintAmount);
        assertEq(token.balanceOf(user), mintAmount, "Minting by owner failed");
    }

    function testRevertWhenMintingByNonOwner() public {
        uint256 mintAmount = 1000 * 10 ** 18;
        vm.prank(user);
        vm.expectRevert("Ownable: caller is not the owner");
        token.mint(user, mintAmount);
    }
}
