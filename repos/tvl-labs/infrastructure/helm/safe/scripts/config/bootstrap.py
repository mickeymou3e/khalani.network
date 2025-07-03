import os

from chains.models import Chain, GasPrice, Feature
from django.core.management.base import BaseCommand
from safe_apps.models import Provider, SafeApp

TRANSACTION_SERVICE_GW_TEST_URI = os.environ.get(
    "TRANSACTION_SERVICE_GW_TEST_URI", "https://safe-txs-godwoken-testnet.khalani.network"
)
TRANSACTION_SERVICE_VPC_GW_TEST_URI = os.environ.get(
    "TRANSACTION_SERVICE_VPC_GW_TEST_URI", "http://safe-txs-godwoken-testnet.applications.svc.cluster.local:8888"
)

TRANSACTION_SERVICE_GW_MAIN_URI = os.environ.get(
    "TRANSACTION_SERVICE_GW_MAIN_URI", "https://safe-txs-godwoken-mainnet.khalani.network"
)
TRANSACTION_SERVICE_VPC_GW_MAIN_URI = os.environ.get(
    "TRANSACTION_SERVICE_VPC_GW_MAIN_URI", "http://safe-txs-godwoken-mainnet.applications.svc.cluster.local:8888"
)

TRANSACTION_SERVICE_KHA_TEST_URI = os.environ.get(
    "TRANSACTION_SERVICE_KHA_TEST_URI", "https://safe-txs-khalani-testnet.khalani.network"
)
TRANSACTION_SERVICE_VPC_KHA_TEST_URI = os.environ.get(
    "TRANSACTION_SERVICE_VPC_KHA_TEST_URI", "http://safe-txs-khalani-testnet.applications.svc.cluster.local:8888"
)

class Command(BaseCommand):
    help = "Bootstrap configuration data"

    def handle(self, *args, **options):
        Chain.objects.all().delete()
        GasPrice.objects.all().delete()
        Provider.objects.all().delete()
        SafeApp.objects.all().delete()

        self._bootstrap_features()

        if Chain.objects.count() == 0:
            self._bootstrap_chain()

    def _bootstrap_features(self):
        self._feature_contract_interaction, _ = Feature.objects.get_or_create(key="CONTRACT_INTERACTION")
        self._feature_domain_lookup, _ = Feature.objects.get_or_create(key="DOMAIN_LOOKUP")
        self._feature_eip1559, _ = Feature.objects.get_or_create(key="EIP1559")
        self._feature_erc721, _ = Feature.objects.get_or_create(key="ERC721")
        self._feature_safe_apps, _ = Feature.objects.get_or_create(key="SAFE_APPS")
        self._feature_safe_tx_gas_optional, _ = Feature.objects.get_or_create(key="SAFE_TX_GAS_OPTIONAL")
        self._feature_spending_limit, _ = Feature.objects.get_or_create(key="SPENDING_LIMIT")

    def _bootstrap_chain(self):
        chain = Chain.objects.create(
            name="Godwoken Mainnet",
            id="71402",
            description="",
            short_name="gwmain",
            l2=True,
            rpc_authentication=Chain.RpcAuthentication.NO_AUTHENTICATION,
            rpc_uri="https://v1.mainnet.godwoken.io/rpc",
            safe_apps_rpc_authentication=Chain.RpcAuthentication.NO_AUTHENTICATION,
            safe_apps_rpc_uri="https://v1.mainnet.godwoken.io/rpc",
            public_rpc_authentication=Chain.RpcAuthentication.NO_AUTHENTICATION,
            public_rpc_uri="https://v1.mainnet.godwoken.io/rpc",
            block_explorer_uri_address_template="https://gwscan.com/account/{{address}}",
            block_explorer_uri_tx_hash_template="https://gwscan.com/tx/{{txHash}}",
            block_explorer_uri_api_template="https://gwscan.com/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}",
            currency_name="pCKB",
            currency_symbol="pCKB",
            currency_decimals=18,
            currency_logo_uri="https://safe-transaction-assets.gnosis-safe.io/chains/73799/currency_logo.png",
            transaction_service_uri=TRANSACTION_SERVICE_GW_MAIN_URI,
            vpc_transaction_service_uri=TRANSACTION_SERVICE_VPC_GW_MAIN_URI,
            theme_text_color="#ffffff",
            theme_background_color="#514989",
            ens_registry_address=None,
            recommended_master_copy_version="1.3.0",
        )
        self._feature_contract_interaction.chains.add(chain)
        self._feature_erc721.chains.add(chain)

        chain = Chain.objects.create(
            name="Godwoken Testnet",
            id="71401",
            description="",
            short_name="gwtest",
            l2=True,
            rpc_authentication=Chain.RpcAuthentication.NO_AUTHENTICATION,
            rpc_uri="https://godwoken-testnet-v1.ckbapp.dev",
            safe_apps_rpc_authentication=Chain.RpcAuthentication.NO_AUTHENTICATION,
            safe_apps_rpc_uri="https://godwoken-testnet-v1.ckbapp.dev",
            public_rpc_authentication=Chain.RpcAuthentication.NO_AUTHENTICATION,
            public_rpc_uri="https://godwoken-testnet-v1.ckbapp.dev",
            block_explorer_uri_address_template="https://v1.testnet.gwscan.com/account/{{address}}",
            block_explorer_uri_tx_hash_template="https://v1.testnet.gwscan.com/tx/{{txHash}}",
            block_explorer_uri_api_template="https://v1.testnet.gwscan.com/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}",
            currency_name="pCKB",
            currency_symbol="pCKB",
            currency_decimals=18,
            currency_logo_uri="https://safe-transaction-assets.gnosis-safe.io/chains/73799/currency_logo.png",
            transaction_service_uri=TRANSACTION_SERVICE_GW_TEST_URI,
            vpc_transaction_service_uri=TRANSACTION_SERVICE_VPC_GW_TEST_URI,
            theme_text_color="#ffffff",
            theme_background_color="#514989",
            ens_registry_address=None,
            recommended_master_copy_version="1.3.0",
        )
        self._feature_contract_interaction.chains.add(chain)
        self._feature_erc721.chains.add(chain)

        chain = Chain.objects.create(
            name="Khalani Testnet",
            id="10012",
            description="",
            short_name="khatest",
            l2=True,
            rpc_authentication=Chain.RpcAuthentication.NO_AUTHENTICATION,
            rpc_uri="https://testnet.khalani.network",
            safe_apps_rpc_authentication=Chain.RpcAuthentication.NO_AUTHENTICATION,
            safe_apps_rpc_uri="https://testnet.khalani.network",
            public_rpc_authentication=Chain.RpcAuthentication.NO_AUTHENTICATION,
            public_rpc_uri="https://testnet.khalani.network",
            block_explorer_uri_address_template="https://block-explorer.testnet.khalani.network/address/{{address}}",
            block_explorer_uri_tx_hash_template="https://block-explorer.testnet.khalani.network/tx/{{txHash}}",
            block_explorer_uri_api_template="https://block-explorer.testnet.khalani.network/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}",
            currency_name="KHA",
            currency_symbol="KHA",
            currency_decimals=18,
            currency_logo_uri="https://safe-transaction-assets.gnosis-safe.io/chains/73799/currency_logo.png",
            transaction_service_uri=TRANSACTION_SERVICE_KHA_TEST_URI,
            vpc_transaction_service_uri=TRANSACTION_SERVICE_VPC_KHA_TEST_URI,
            theme_text_color="#ffffff",
            theme_background_color="#514989",
            ens_registry_address=None,
            recommended_master_copy_version="1.3.0",
        )
        self._feature_contract_interaction.chains.add(chain)
        self._feature_erc721.chains.add(chain)