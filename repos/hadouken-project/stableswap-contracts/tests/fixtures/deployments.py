import pytest
from brownie import Contract


def _swap(
    project,
    alice,
    underlying,
    wrapped,
    pool_token,
    pool_data,
    swap_mock,
    base_swap,
):
    deployer = getattr(project, pool_data["swap_contract"])

    abi = next(i["inputs"] for i in deployer.abi if i["type"] == "constructor")

    args = {
        "_coins": wrapped,
        "_underlying_coins": underlying,
        "_pool_token": pool_token,
        "_base_pool": base_swap,
        "_A": 360 * 2,
        "_fee": 0,
        "_admin_fee": 0,
        "_offpeg_fee_multiplier": 0,
        "_owner": alice,
        "_reward_admin": alice,
        "_reward_claimant": alice,
        "_y_pool": swap_mock,
    }
    deployment_args = [args[i["name"]] for i in abi] + [({"from": alice})]

    contract = deployer.deploy(*deployment_args)
    pool_token.set_minter(contract, {"from": alice})

    for coin in [i for i in wrapped if hasattr(i, "_set_pool")]:
        # required for aTokens
        coin._set_pool(contract)

    return contract


@pytest.fixture(scope="module")
def swap(
    project,
    alice,
    _underlying_coins,
    wrapped_coins,
    pool_token,
    pool_data,
    swap_mock,
    base_swap,
):
    return _swap(
        project,
        alice,
        _underlying_coins,
        wrapped_coins,
        pool_token,
        pool_data,
        swap_mock,
        base_swap,
    )


@pytest.fixture(scope="module")
def base_swap(project, charlie, _base_coins, base_pool_token, base_pool_data):
    if base_pool_data is None:
        return
    return _swap(
        project,
        charlie,
        _base_coins,
        _base_coins,
        base_pool_token,
        base_pool_data,
        None,
        None,
        None,
    )


@pytest.fixture(scope="module")
def swap_mock(SwapMock, pool_data, alice):
    if pool_data["name"] == "snow":
        return SwapMock.deploy({"from": alice})


@pytest.fixture(scope="module")
def zap(project, alice, swap, underlying_coins, wrapped_coins, pool_token, pool_data):
    deployer = getattr(project, pool_data.get("zap_contract"), None)
    if deployer is None:
        return

    abi = next(i["inputs"] for i in deployer.abi if i["type"] == "constructor")
    args = {
        "_coins": wrapped_coins,
        "_underlying_coins": underlying_coins,
        "_token": pool_token,
        "_pool": swap,
        "_curve": swap,
    }
    deployment_args = [args[i["name"]] for i in abi] + [({"from": alice})]

    return deployer.deploy(*deployment_args)
