# Development Network (DevNet) control script

This script controls the devnet to allow Medulla team to reset the devnet when needed. The validator gran and aura keys are pre-loaded in the script, the validator nodes already contain all relevant genesis spec and node-subtensor wasm executables, hence no extra files are needed. 

To reset devnet:

1. `./staging_ctrl.sh <your SSH key file> stop` to stop all nodes.
2. `./staging_ctrl.sh <your SSH key file> delete_db` to delete all node databases.
3. `./staging_ctrl.sh <your SSH key file> start_bootnode` will start only the bootnode (validator-dev-01), this is the node that all other nodes will use to boot up. At this point, it is important to look into the logs of this node (enter sudo by using `sudo -i`, then call `pm2 logs 0`). If the message shows something like `(0 peers) best #0, finalized #0` then the bootnode is up.
4. `./staging_ctrl.sh <your SSH key file> start_validators` will start all other validators. You should now check into the logs of the other nodes (enter sudo by using `sudo -i`, then call `pm2 logs 0`). If the message shows something like `(4 peers) best #0, finalized #0` then the bootnode is up. It does not necessarily need to show 4 peers, simply that there is > 0 peers to indicate peering and networking is operational.
5. `./staging_ctrl.sh <your SSH key file> insert_keys` will insert the validator authority keys.
6. `./staging_ctrl.sh <your SSH key file> restart_all_validators` will restart all validators so they can pick up the newly inserted authority keys. Once you start seing `best` **and** `finalized` both start going above #0, then the validators are validating appropriately.

> Note: There is also the upload_file command which allows you to upload any file from and to any directory on the validators. This is particularly useful if you wish to upload a new chain spec.
