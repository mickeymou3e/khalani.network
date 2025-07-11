#!/bin/bash

# all 6 staging validators
# bootnode ip: 3.81.35.135
IP_LIST=("3.81.35.135" "3.84.68.148" "54.80.15.22" "54.166.199.63" "107.22.130.0")
BOOTNODE_IP="3.81.35.135"
DB_LOCATION="/var/lib/subtensor/chains/bittensor/db/"
SSH_KEY=$1
COMMAND=$2
FILE=$3
REMOTE_FILE_PATH=$4

upload_file() {
    for IP in "${IP_LIST[@]}"
    do
        echo "Syncing with $IP..."
        rsync -vz --progress -e "ssh -i ~/.ssh/$SSH_KEY -p 20222" --rsync-path="sudo rsync" --exclude='.*/' ./$FILE ubuntu@$IP:$REMOTE_FILE_PATH
        # Check if rsync was successful
        if [ $? -eq 0 ]; then
            echo "Sync with $IP completed successfully."
        else
            echo "Error: Sync with $IP failed."
            break
        fi
        sleep 3
    done
}

stop_pm2() {
    for IP in "${IP_LIST[@]}"
    do
        echo "Stopping PM2 on $IP"
        ssh -i ~/.ssh/$SSH_KEY -p 20222 ubuntu@$IP -t 'sudo pm2 stop all'
                # Check if rsync was successful
        if [ $? -eq 0 ]; then
            echo "Stopped PM2 on $IP successfully."
        else
            echo "Error: Sync with $IP failed."
        fi
    done
}

start_pm2() {
    for IP in "${IP_LIST[@]}"
    do
        echo "Starting PM2 on $IP"
        ssh -i ~/.ssh/$SSH_KEY -p 20222 ubuntu@$IP -t 'sudo pm2 start 0'
                # Check if rsync was successful
        if [ $? -eq 0 ]; then
            echo "Started up PM2 on $IP successfully."
        else
            echo "Error: Sync with $IP failed."
        fi
    done
}

delete_db() {
    for IP in "${IP_LIST[@]}"
    do
        echo "Deleting db in $DB_LOCATION at $IP"
        ssh -i ~/.ssh/$SSH_KEY -p 20222 ubuntu@$IP -t "sudo rm -rf $DB_LOCATION"
                # Check if rsync was successful
        if [ $? -eq 0 ]; then
            echo "Deleted DB on $IP successfully."
        else
            echo "Error: Sync with $IP failed."
        fi
    done
}

start_validators() {
    for IP in "${IP_LIST[@]}"
    do
        echo "Starting up a new node on $IP"
        if [ $IP != $BOOTNODE_IP ]; then
            delete_pm2 "$IP"
            ssh -i ~/.ssh/$SSH_KEY -p 20222 ubuntu@$IP -t 'sudo pm2 start /opt/ops/blockchain/bin/node-subtensor --name staging-validator -- --validator --force-authoring --chain /opt/ops/blockchain/specs/raw_testspec.json --base-path /var/lib/subtensor --pruning=archive --execution wasm --wasm-execution compiled --port 30333 --max-runtime-instances 64 --rpc-max-response-size 2048 --bootnodes /ip4/3.81.35.135/tcp/30333/p2p/12D3KooWLWMzfMZbQbZWFZauMEVJmY571PNafRrcQstsSSBgPDD3 --ws-max-connections 16000 --no-mdns'

            # Check if rsync was successful
            if [ $? -eq 0 ]; then
                echo "Started up new node $IP successfully."
            else
                echo "Error: Sync with $IP failed."
            fi
        fi
    done
}
# --bootnodes /ip4/13.58.175.193/tcp/30333/p2p/12D3KooWDe7g2JbNETiKypcKT1KsCEZJbTzEHCn8hpd4PHZ6pdz5
start_bootnode() {
    delete_pm2 "$BOOTNODE_IP"
    ssh -i ~/.ssh/$SSH_KEY -p 20222 ubuntu@$BOOTNODE_IP -t 'sudo pm2 start /opt/ops/blockchain/bin/node-subtensor --name staging-validator -- --validator --force-authoring --chain /opt/ops/blockchain/specs/raw_testspec.json --base-path /var/lib/subtensor --pruning=archive --execution wasm --wasm-execution compiled --port 30333 --rpc-cors all --rpc-port 9933 --ws-port 9944 --max-runtime-instances 64 --rpc-max-response-size 2048 --node-key fb4f884fd92a5d66237f0e5fab2045b9a8427b755f195e6451b85bbe4975304c --ws-max-connections 16000 --no-mdns'

    # Check if rsync was successful
    if [ $? -eq 0 ]; then
        echo "Started up bootnode on $IP successfully."
    else
        echo "Error: Sync with $IP failed."
    fi
}

insert_keys() {
    ssh -i ~/.ssh/$SSH_KEY -p 20222 ubuntu@$BOOTNODE_IP -t "curl -sH 'Content-Type: application/json' --data '{ \"jsonrpc\":\"2.0\", \"method\":\"author_insertKey\", \"params\":[\"aura\", \"0x1fa3cb3b44099c2be3b4a1a76e36a2e5015992104b1ddc1e005c61239474adc7\", \"0x62beb41285c0e6c1e436f869a59fc07eaaddb3f02ac77a119019b0b38512641e\"],\"id\":1 }' 127.0.0.1:9933 && curl -sH 'Content-Type: application/json' --data '{ \"jsonrpc\":\"2.0\", \"method\":\"author_insertKey\", \"params\":[\"gran\", \"0xf5fa8cc5cc4308468b2a69919daf21e337e52b9448dd5af91a3ad900f2323e84\", \"0x07e4dfd328c5dd93c88c9aa5410d1bd470a9098965ada4c34439ee6ba959d25c\"],\"id\":1 }' 127.0.0.1:9933"
     # Check if rsync was successful
    if [ $? -eq 0 ]; then
        echo "Inserted keys to node $IP successfully."
    else
        echo "Error: Sync with $IP failed."
    fi

    ssh -i ~/.ssh/$SSH_KEY -p 20222 ubuntu@${IP_LIST[1]} -t "curl -sH 'Content-Type: application/json' --data '{ \"jsonrpc\":\"2.0\", \"method\":\"author_insertKey\", \"params\":[\"aura\", \"0x9c0898e67fb15500f9edf0e1e694b15ef9a2a628499797b05f8a4467af7d1254\", \"0xfcbe12e2504cab177f1a745024a5373daae55ab1d5a4b1ea3eb57218c8358f0c\"],\"id\":1 }' 127.0.0.1:9933 && curl -sH 'Content-Type: application/json' --data '{ \"jsonrpc\":\"2.0\", \"method\":\"author_insertKey\", \"params\":[\"gran\", \"0x5612dc71d3b8bdd4f42db9a504af736282895228dcaa88bb62522834c3ac9c31\", \"0xad6370c685ea527103784ae877a02ac9d734502da92acb8dbc6946f0b491e28a\"],\"id\":1 }' 127.0.0.1:9933"
     # Check if rsync was successful
    if [ $? -eq 0 ]; then
        echo "Inserted keys to node $IP successfully."
    else
        echo "Error: Sync with $IP failed."
    fi

    ssh -i ~/.ssh/$SSH_KEY -p 20222 ubuntu@${IP_LIST[2]} -t "curl -sH 'Content-Type: application/json' --data '{ \"jsonrpc\":\"2.0\", \"method\":\"author_insertKey\", \"params\":[\"aura\", \"0x526abc7a01467a854af6853b82c9df6171dc57e8f1fe408923b7efc3f60db7de\", \"0xa0aae4c5d0fdab89e9f64b578465c7386c0a164e9c389286e1cc3e6cee093523\"],\"id\":1 }' 127.0.0.1:9933 && curl -sH 'Content-Type: application/json' --data '{ \"jsonrpc\":\"2.0\", \"method\":\"author_insertKey\", \"params\":[\"gran\", \"0x5ab7c33c16c9d52657766e69ecba0881b61e06f908f4ea4345d3f08a624c72b1\", \"0xa031739beed321480c5ed003118bc91492bd4ba0153e0f9a1516d33de907b7f8\"],\"id\":1 }' 127.0.0.1:9933"
     # Check if rsync was successful
    if [ $? -eq 0 ]; then
        echo "Inserted keys to node $IP successfully."
    else
        echo "Error: Sync with $IP failed."
    fi

    ssh -i ~/.ssh/$SSH_KEY -p 20222 ubuntu@${IP_LIST[3]} -t "curl -sH 'Content-Type: application/json' --data '{ \"jsonrpc\":\"2.0\", \"method\":\"author_insertKey\", \"params\":[\"aura\", \"0x33104752ad5f45052b21a823c518a0c9ff85ef6367973b388df4121cb11b5dad\", \"0x4655e26fad030aa51508349153706628dfaaa646a80c0c8552a95248a71db33e\"],\"id\":1 }' 127.0.0.1:9933 && curl -sH 'Content-Type: application/json' --data '{ \"jsonrpc\":\"2.0\", \"method\":\"author_insertKey\", \"params\":[\"gran\", \"0x4d7ea47b516ee68cfd1ab75391ae24a27f36dcbfe9dc04967c4467d44f09d484\", \"0x55c2fddf7d26e70c817cbc1410d2e8b2a328a47ae65494a33c82ca24a37c1b94\"],\"id\":1 }' 127.0.0.1:9933"
     # Check if rsync was successful
    if [ $? -eq 0 ]; then
        echo "Inserted keys to node $IP successfully."
    else
        echo "Error: Sync with $IP failed."
    fi

    ssh -i ~/.ssh/$SSH_KEY -p 20222 ubuntu@${IP_LIST[4]} -t "curl -sH 'Content-Type: application/json' --data '{ \"jsonrpc\":\"2.0\", \"method\":\"author_insertKey\", \"params\":[\"aura\", \"0x916141df33a29a9f557db3212883a2970633d0f8ec62a0511b969bb163d9eaaa\", \"0x5000273b4ccf4824162465e0052ea578ddf5325b1c82938423762982bfc4ec74\"],\"id\":1 }' 127.0.0.1:9933 && curl -sH 'Content-Type: application/json' --data '{ \"jsonrpc\":\"2.0\", \"method\":\"author_insertKey\", \"params\":[\"gran\", \"0x0177cc0dedae24d20451827255e3725bcf762405ca3302c846f69577e64f211b\", \"0x4e9c5eeb4e0ff2453f37ed3de62166f4b0a23bf58a90258c0a62ef3a8d0d4fc0\"],\"id\":1 }' 127.0.0.1:9933"
     # Check if rsync was successful
    if [ $? -eq 0 ]; then
        echo "Inserted keys to node $IP successfully."
    else
        echo "Error: Sync with $IP failed."
    fi

    ssh -i ~/.ssh/$SSH_KEY -p 20222 ubuntu@${IP_LIST[5]} -t "curl -sH 'Content-Type: application/json' --data '{ \"jsonrpc\":\"2.0\", \"method\":\"author_insertKey\", \"params\":[\"aura\", \"0xc11f2b614f9dc41a2c813c488fd601879d4b35c70d08de9a538e22dc87c072be\", \"0x50b6924bce9e06268d6221e82762ac7b5772e7988974f339106e918edb9c0039\"],\"id\":1 }' 127.0.0.1:9933 && curl -sH 'Content-Type: application/json' --data '{ \"jsonrpc\":\"2.0\", \"method\":\"author_insertKey\", \"params\":[\"gran\", \"0x97985e2366eea4da06fade9dad7ff0f1527cf66c93f08515e3eba3fdad5f4e70\", \"0x37f3266fdf6f8777a878dad869e2fcb3eca6198690296d795a7006db5d4c5b13\"],\"id\":1 }' 127.0.0.1:9933"
     # Check if rsync was successful
    if [ $? -eq 0 ]; then
        echo "Inserted keys to node $IP successfully."
    else
        echo "Error: Sync with $IP failed."
    fi


}

restart_all_validators() {
    for IP in "${IP_LIST[@]}"
    do
        echo "Restarting node on $IP"
        ssh -i ~/.ssh/$SSH_KEY -p 20222 ubuntu@$IP -t 'sudo pm2 stop 0'
        ssh -i ~/.ssh/$SSH_KEY -p 20222 ubuntu@$IP -t 'sudo pm2 start 0'
        # Check if rsync was successful
        if [ $? -eq 0 ]; then
            echo "Restarted PM2 on $IP successfully."
        else
            echo "Error: Sync with $IP failed."
        fi
        
    done
}



delete_pm2() {
    ssh -i ~/.ssh/$SSH_KEY -p 20222 ubuntu@$1 -t 'sudo pm2 del all'

    # Check if rsync was successful
    if [ $? -eq 0 ]; then
        echo "Started up bootnode on $IP successfully."
    else
        echo "Error: Sync with $IP failed."
    fi
}

delete_all_pm2() {
    for IP in "${IP_LIST[@]}"
    do
        ssh -i ~/.ssh/$SSH_KEY -p 20222 ubuntu@$IP -t 'sudo pm2 del 0'

        # Check if rsync was successful
        if [ $? -eq 0 ]; then
            echo "Deleted PM2 on $IP successfully."
        else
            echo "Error: Sync with $IP failed."
        fi
    done
}


# Use a case statement to call a function based on COMMAND
case "$COMMAND" in
    upload_file)
        upload_file
        ;;
    stop)
        stop_pm2
        ;;
    start)
        start_pm2
        ;;
    delete_db)
        delete_db
        ;;
    delete_all_pm2)
        delete_all_pm2
        ;;
    start_bootnode)
        start_bootnode
        ;;
    start_validators)
        start_validators
        ;;
    insert_keys)
        insert_keys
        ;;
    restart_all_validators)
        restart_all_validators
        ;;
    *)
        # This is the correct place for the default case actions
        echo "Usage: $0 {ssh_key} {command}"
        exit 1
        ;;
esac