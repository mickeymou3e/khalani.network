from substrateinterface import SubstrateInterface
from substrateinterface.utils.hasher import xxh128
from diskcache import Cache
import matplotlib.pyplot as plt

cache = Cache("cache")

print("Initializing node interface...")
substrate = SubstrateInterface("wss://entrypoint-finney.opentensor.ai:443")


@cache.memoize()
def get_block_hash(n):
    return substrate.get_block_hash(n)


@cache.memoize()
def get_sub_keys(key_hex, n):
    response = substrate.rpc_request(
        method="state_getKeys", params=[key_hex, get_block_hash(n)]
    )
    return response["result"]


@cache.memoize()
def get_storage_key_size(key_hex, n):
    response = substrate.rpc_request(
        method="state_getStorageSize", params=[key_hex, get_block_hash(n)]
    )
    if "result" in response:
        return response["result"]
    else:
        print(f"Unexpected response format: {response}")
        return None


@cache.memoize()
def get_storage_key_hex(pallet, entry):
    storage_hash = xxh128(pallet.encode()) + xxh128(entry.encode())
    return storage_hash.hex()


@cache.memoize()
def get_storage_keys():
    print("Computing storage keys...")
    metadata = substrate.get_metadata()
    keys = []
    for pallet in metadata.pallets:
        if pallet.value.get("storage") and pallet.value["storage"].get("entries"):
            for entry in pallet.value["storage"]["entries"]:
                hex = get_storage_key_hex(pallet.value["name"], entry["name"])
                keys.append((pallet.value["name"], entry["name"], hex))

    return keys


def plot_size(data):
    data.sort(key=lambda x: x[2], reverse=True)
    top_data = data[:20]

    pallets = [f"{pallet}:{entry}" for pallet, entry, _, _ in top_data]
    sizes = [size for _, _, size, _ in top_data]

    plt.figure(figsize=(10, 6))
    plt.bar(pallets, sizes, color="blue")
    plt.xlabel("Pallet:Entry")
    plt.ylabel("Size (MB)")
    plt.title("Storage Key Value Storage Usage")
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    plt.show()


def plot_keys(data):
    data.sort(key=lambda x: x[3], reverse=True)
    top_data = data[:20]

    pallets = [f"{pallet}:{entry}" for pallet, entry, _, _ in top_data]
    n_subkeys = [n_subkeys for _, _, _, n_subkeys in top_data]
    key_storage_size = [n_subkey * 48 / (1024 * 1024)
                        for n_subkey in n_subkeys]

    fig, ax1 = plt.subplots(figsize=(10, 6))

    color = "tab:blue"
    ax1.set_xlabel("Pallet:Entry")
    ax1.set_ylabel("N Subkeys", color=color)
    ax1.bar(pallets, n_subkeys, color=color)
    ax1.tick_params(axis="y", labelcolor=color)
    ax1.set_xticklabels(pallets, rotation=45, ha="right")

    ax2 = ax1.twinx()
    color = "tab:red"
    ax2.set_ylabel("Key Storage Size (MB)", color=color)
    ax2.plot(pallets, key_storage_size, color=color, marker="o")
    ax2.tick_params(axis="y", labelcolor=color)

    fig.tight_layout()
    plt.title("Storage Key Subkey Storage Usage")
    plt.show()


BLOCK = 3104620


def main():
    keys = get_storage_keys()
    data = []
    for pallet, entry, hex in keys:
        size = get_storage_key_size(hex, BLOCK) or 0
        sub_keys = get_sub_keys(hex, BLOCK)
        size_mb = size / (1024 * 1024)
        data.append((pallet, entry, size_mb, len(sub_keys)))

    data.sort(key=lambda x: x[3], reverse=True)
    for pallet, entry, size, n_subkeys in data:
        print(f"{pallet}:{entry} - {size} - {n_subkeys}")
    plot_size(data)
    plot_keys(data)


if __name__ == "__main__":
    main()
