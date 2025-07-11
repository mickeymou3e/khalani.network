# The MIT License (MIT)
# Copyright © 2024 Opentensor Foundation

# Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
# documentation files (the “Software”), to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
# and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all copies or substantial portions of
# the Software.

# THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
# THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
# DEALINGS IN THE SOFTWARE.

import json
import argparse
import bittensor as bt
from rich.prompt import Prompt, Confirm
from rich.console import Console
from bittensor.btlogging import logging as _logger

console = Console()

# First let's get the wallet from the command line.
parser = argparse.ArgumentParser('safe transfer command')
parser.add_argument('--old_wallet', type=str, help='The name of the wallet which you want to transfer from.', default=None)
parser.add_argument('--new_wallet_address', type=str, help='The addres of the wallet you want to transfer funds to.', default=None)
bt.wallet.add_args( parser )
bt.subtensor.add_args( parser )
config = bt.config( parser )

# First check that we can reach the chain.
_logger.off()
try:
    sub = bt.subtensor(config.subtensor.chain_endpoint)
except Exception as e:
    console.print(f"[bold white]\n\tYou, failed to connect to the chain over internet. Please check your internet connection and retry:[/bold white] [red]\n\t{e}[/red]")
    exit()

# Let's check the wallet name
# Get the wallet name from the config or prompt the user
old_wallet_name = config.old_wallet
if not config.is_set('old_wallet'):
    console.print("[bold white]You must specify the [blue] \"--old_wallet\" [/blue] command line argument. [/bold white]")
    console.print("[white]\n\t> The [blue]\"--old_wallet\"[/blue] is the wallet that will transfer the funds to the new [red]\"--new_wallet_address\"[\red] [/white]")
    console.print("[white]\t> Run the command like this:[/white]")
    console.print("[white]\t\t$ python3 safe_transfer.py --old_wallet=[blue]<old_wallet_name>[/blue] --new_wallet_address=[red]<new_wallet_address>[/red][/white]")
    console.print("[white]\t> For example:[/white]")
    console.print("[white]\t\t$ python3 safe_transfer.py --old_wallet=[blue]my_OLD_fav_wallet[/blue] --new_wallet_address=[red]5DPB62QK6XsSbuFd9g4QAzqq9P5Pzi32P2wBSRS4jdJGLcew[/red]\t[/white]")
    console.print("[red]Aborting\n[/red]")
    exit()
    
# Lets get the new wallet name
new_wallet_address = config.new_wallet_address
if not config.is_set('new_wallet_address'):
    console.print("[bold white]\nYou must specify the [red]\"--new_wallet_address\"[/red] command line argument.[/bold white]")
    console.print("[white]\n\t> The [red]\"--new_wallet_address\"[/red]is the address that will receive the funds transfered from the [blue]\"--old_wallet\"[/blue][/white]")
    console.print("[white]\t> Run the command like this:[/white]")
    console.print("[white]\t\t$ python3 safe_transfer.py --old_wallet=[blue]<old_wallet_name>[/blue] --new_wallet_address=[red]<new_wallet_name>[/red][/white]")
    console.print("[white]\t> For example:[/white]")
    console.print("[white]\t\t$ python3 safe_transfer.py --old_wallet=[blue]my_fav_wallet[/blue]  --new_wallet_address=[red]5DPB62QK6XsSbuFd9g4QAzqq9P5Pzi32P2wBSRS4jdJGLcew[/red][/white]")
    console.print("[red]Aborting\n[/red]")
    exit()
    
# Create a wallet object with the specified name
old_wallet = bt.wallet(name=old_wallet_name)

# Assert that the old wallet exists.
if not old_wallet.coldkey_file.is_readable():
    console.print(f"[bold white]\nThe wallet [blue]\"{old_wallet_name}\"[/blue] does not exist on this device.[/bold white]")
    console.print(f"[white]\n\t> You must run this command from the device where this wallet is stored.[/white]")
    console.print(f"[white]\t> To see which wallets are stored on this device run the following command on your terminal:[/white]")
    console.print("[white]\t\t$ btcli wallet list[/white]")
    console.print("[white]\t\t> or[/white]")
    console.print("[white]\t\t$ ~/.bittensor/wallets\n[/white]")
    console.print("[red]Aborting\n[/red]")
    exit()
    

# Assert that the new wallet exist.
# if not new_wallet.coldkey_file.is_readable():
#     console.print(f"[bold white]\nThe wallet [red]\"{new_wallet_name}\"[/red] does not exist on this device.[/bold white]")
#     console.print(f"[white]\n\t> You must create [red]\"{new_wallet_name}\"[/red] before running this command. [/white]")
#     console.print(f"[white]\t> To create [red]\"{new_wallet_name}\"[/red] on this device run the following command from your terminal:[/white]")
#     console.print(f"[white]\t\t$ btcli wallet create --wallet.name=[red]{new_wallet_name}[/red]\n[/white]")
#     console.print("[red]Aborting\n[/red]")
#     exit()
    
# Print wallet information
console.print("\n[bold white]Transfer Details[/bold white]")
console.print(f"  [bold white]\t> Using wallet name:[/bold white] [blue]{old_wallet_name}[/blue]")
console.print(f"  [bold white]\t> From:[/bold white] [blue]{old_wallet.coldkeypub.ss58_address}[/blue] [bold white] --> To[/bold white] : [red]{new_wallet_address}\n[/red]")
# console.print(f"[bold white]\n> NOTE: this only CREATES the transaction and [yellow]prints[/yellow] it to the screen. It does NOT send the transaction to the chain.[/bold white]")
# console.print(f"[bold white]\n> [yellow]WARNING[/yellow]: Make sure that the address: [red]{new_wallet_address}[/red] corresponds correctly to the wallet where you want to transfer the funds. If this is not the correct wallet abort with ctrl-c.")
# if not Confirm.ask(f"[bold white]\nWould you like to sign the above transaction with your [blue]\"{old_wallet_name}\"[/blue] wallet and CONTINUE?[/bold white]\n"):
#     console.print("[red]Exiting[/red]")
#     exit()


# Decrypt and continue.
_logger.on()
old_wallet.coldkey

# Create the swap command.
try:
        # call = sub.substrate.compose_call(
        #     call_module="SubtensorModule",
        #     call_function="unstake_all_and_transfer_to_new_coldkey",
        #     call_params={"new_coldkey": new_wallet_address}
        # )
        call = sub.substrate.compose_call(
            call_module="Balances",
            call_function="transfer_allow_death",
            call_params={"dest": new_wallet_address, "value": 1_000_000}
        )
        extrinsic = sub.substrate.create_signed_extrinsic(
            call = call, 
            keypair = old_wallet.coldkey
        )
except Exception as e:
    console.print(f"[bold red]An error occured while creating the transfer transaction: [white]{e}[/white][/bold red]")
    console.print(f"[bold red]Please reach out to moderators in the Bittensor discord with your error.[/bold red]")
    exit()


# console.print("\n[bold white]===== Transfer Details =====[/bold white]")
# console.print("-" * 50)
# console.print(f"[bold cyan]\t> Old Wallet Name:[/bold cyan] [blue]{old_wallet_name}[/blue] \n\t\t> [blue]address: {old_wallet.coldkeypub.ss58_address}[/blue]")
# console.print(f"[bold cyan]\t> New Wallet Address: [red]{new_wallet_address}[/red][/bold cyan]")
# console.print("-" * 50)
# console.print("[bold white]===== End of Transfer Details =====[/bold white]\n")

import hashlib

# Write the extrinsic nicely to a file
output_to_screen = {
    'coldkey_ss58': old_wallet.coldkey.ss58_address,
    'new_wallet_address': new_wallet_address,
    'extrinsic_data': str(extrinsic.data),
}
output_to_screen['signature'] = old_wallet.coldkey.sign( str(extrinsic.data) ).hex()
output_to_screen['hash'] = hashlib.sha256(str(extrinsic.data).encode()).hexdigest()
# Create the filename using the first and last 5 letters of the hash of the extrinsic data string
extrinsic_data_str = str(extrinsic.data)
extrinsic_data_hash = hashlib.sha256(extrinsic_data_str.encode()).hexdigest()
filename = f"my_transfer_{old_wallet.coldkey.ss58_address[:10]}.json"

# Write the output to the file.
with open(filename, 'w') as f:
    f.truncate(0)
    json.dump(output_to_screen, f, indent=4)
    
import json
import bittensor as bt
from binascii import unhexlify
with open(filename, 'r') as file:
    transaction_data = json.loads(file.read())

keypair = bt.Keypair(transaction_data['coldkey_ss58'])
print( 'is_valid', keypair.verify(transaction_data['extrinsic_data'], unhexlify(transaction_data['signature'].encode())) )

import os
console.print(f"[white]\n\nWe've written the transaction details to the file [bold yellow]\'{os.getcwd()}/{filename}\'[/bold yellow] in your local directory.[/white]")
console.print(f"[white]Find [bold yellow]`{filename}`[/bold yellow] attach this file as a direct message with the **@bridge_transaction_bot** found in the Bittensor discord annoucement. [/white]\n")
console.print(f"[white]See the README.md Step 4 instructions for more details.[/white]\n")
