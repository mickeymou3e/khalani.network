import pytest
from brownie import ETH_ADDRESS, ZERO_ADDRESS, ERC20Mock, ERC20MockNoReturn
from brownie_tokens import MintableForkToken

# public fixtures - these can be used when testing

@pytest.fixture(scope="module")
def wrapped_coins(project, alice, pool_data, _underlying_coins):
    return _wrapped(project, alice, pool_data, _underlying_coins)


@pytest.fixture(scope="module")
def underlying_coins(_underlying_coins, _base_coins):
    if _base_coins:
        return _underlying_coins[:1] + _base_coins
    else:
        return _underlying_coins


@pytest.fixture(scope="module")
def pool_token(project, alice, pool_data):
    return _pool_token(project, alice, pool_data)


@pytest.fixture(scope="module")
def base_pool_token(project, charlie, base_pool_data):
    if base_pool_data is None:
        return

    # we do some voodoo here to make the base LP tokens work like test ERC20's
    # charlie is the initial liquidity provider, he starts with the full balance
    def _mint_for_testing(target, amount, tx=None):
        token.transfer(target, amount, {"from": charlie})

    token = _pool_token(project, charlie, base_pool_data)
    token._mint_for_testing = _mint_for_testing
    return token


def _deploy_wrapped(project, alice, pool_data, idx, underlying):
    coin_data = pool_data["coins"][idx]
    fn_names = WRAPPED_COIN_METHODS[pool_data["wrapped_contract"]]
    deployer = getattr(project, pool_data["wrapped_contract"])

    decimals = coin_data["wrapped_decimals"]
    name = coin_data.get("name", f"Coin {idx}")
    symbol = coin_data.get("name", f"C{idx}")

    if pool_data["wrapped_contract"] == "ATokenMock":
        contract = deployer.deploy(
            name, symbol, decimals, underlying, {"from": alice}
        )
    else:
        contract = deployer.deploy(name, symbol, decimals, underlying, {"from": alice})

    for target, attr in fn_names.items():
        if target != attr:
            setattr(contract, target, getattr(contract, attr))
    if coin_data.get("withdrawal_fee"):
        contract._set_withdrawal_fee(coin_data["withdrawal_fee"], {"from": alice})

    return contract


def _wrapped(project, alice, pool_data, underlying_coins):
    coins = []

    if not pool_data.get("wrapped_contract"):
        return underlying_coins

    for i, coin_data in enumerate(pool_data["coins"]):
        underlying = underlying_coins[i]
        if not coin_data.get("wrapped_decimals") or not coin_data.get("decimals"):
            coins.append(underlying)
        else:
            contract = _deploy_wrapped(project, alice, pool_data, i, underlying)
            coins.append(contract)
    return coins


def _underlying(alice, project, pool_data, base_pool_token):
    coins = []


    for i, coin_data in enumerate(pool_data["coins"]):
        if coin_data.get("underlying_address") == ETH_ADDRESS:
            coins.append(ETH_ADDRESS)
            continue
        if coin_data.get("base_pool_token"):
            coins.append(base_pool_token)
            continue
        if not coin_data.get("decimals"):
            contract = _deploy_wrapped(project, alice, pool_data, i, ZERO_ADDRESS, ZERO_ADDRESS)
        else:
            decimals = coin_data["decimals"]
            deployer = ERC20MockNoReturn if coin_data["tethered"] else ERC20Mock
            contract = deployer.deploy(
                f"Underlying Coin {i}", f"UC{i}", decimals, {"from": alice}
            )
        coins.append(contract)

    return coins

def _wrapped(project, alice, pool_data, underlying_coins):
    coins = []

    if not pool_data.get("wrapped_contract"):
        return underlying_coins

    print('wrapped_contract', pool_data.get("wrapped_contract"))

    for i, coin_data in enumerate(pool_data["coins"]):
        underlying = underlying_coins[i]
        if not coin_data.get("wrapped_decimals") or not coin_data.get("decimals"):
            coins.append(underlying)
        else:
            contract = _deploy_wrapped(project, alice, pool_data, i, underlying)
            coins.append(contract)
    return coins


def _underlying(alice, project, pool_data, base_pool_token):
    coins = []

    for i, coin_data in enumerate(pool_data["coins"]):
        print('coin_data.get("name")', coin_data.get("name"))
        print('coin_data.get("underlying_address")', coin_data.get("underlying_address"))
        print('coin_data.get("base_pool_token")', coin_data.get("base_pool_token"))
        print('coin_data.get("decimals")', coin_data.get("decimals"))

        if coin_data.get("underlying_address") == ETH_ADDRESS:
            coins.append(ETH_ADDRESS)
            continue
        if coin_data.get("base_pool_token"):
            coins.append(base_pool_token)
            continue
        if not coin_data.get("decimals"):
            contract = _deploy_wrapped(project, alice, pool_data, i, ZERO_ADDRESS, ZERO_ADDRESS)
        else:
            decimals = coin_data["decimals"]
            deployer = ERC20Mock
            contract = deployer.deploy(
                f"Underlying Coin {i}", f"UC{i}", decimals, {"from": alice}
            )
        coins.append(contract)

    return coins


def _pool_token(project, alice, pool_data):
    name = pool_data["name"]
    print('pool_data[name]', name)
    deployer = getattr(project, pool_data["lp_contract"])
    args = [f"Curve {name} LP Token", f"{name}CRV", 18, 0][: len(deployer.deploy.abi["inputs"])]
    return deployer.deploy(*args, {"from": alice})

# private fixtures used for setup in other fixtures - do not use in tests!


@pytest.fixture(scope="module")
def _underlying_coins(
    alice, project, pool_data, base_pool_token, _add_base_pool_liquidity
):
    return _underlying(alice, project, pool_data, base_pool_token)


@pytest.fixture(scope="module")
def _base_coins(alice, project, base_pool_data):
    if base_pool_data is None:
        return []
    return _underlying(alice, project, base_pool_data, None)
