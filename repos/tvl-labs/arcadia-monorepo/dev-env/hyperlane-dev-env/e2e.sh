#!/bin/bash

echo "Starting e2e test"
rm -f ./*.ready
rm -f ./*.failed


cleanup_and_exit() {
    local exit_code=$1
    echo "Cleaning up processes..."
    pkill -f "node" 2>/dev/null
    pkill -f "anvil" 2>/dev/null
    pkill -f "hyperlane" 2>/dev/null
    pkill -f "medusa" 2>/dev/null
    pkill -f "solver" 2>/dev/null
    rm -f ./*.failed
    rm -f ./*.ready
    exit $exit_code
}

trap cleanup_and_exit INT TERM

node multi-node.mjs 2>&1 | while IFS= read -r line; do
    echo "$line"
    if echo "$line" | grep -q "Error"; then
        echo "Error occurred in multi-node.mjs"
        touch ./multinode.failed
    fi
    if echo "$line" | grep -q "🚚  Relayer started "; then
        echo "MultiNode is ready"
        touch ./multinode.ready
    fi
done &

while [ ! -f ./multinode.ready ]; do # will ignore errors after ready
    if [ -f ./multinode.failed ]; then
        echo "💀 FATAL: multi-node.mjs failed"
        cleanup_and_exit 1
    fi
    sleep 2
    echo "Waiting for multi-node to be ready"
done


node run-medusa.mjs 2>&1 | while IFS= read -r line; do
    echo "$line"
    if echo "$line" | grep -q "Error"; then 
        echo "Error occurred in run-medusa.mjs"
        touch ./medusa.failed
    fi
    if echo "$line" | grep -q "start running rpc server"; then
        echo "Medusa is ready"
        touch ./medusa.ready
    fi
done &

while [ ! -f ./medusa.ready ]; do # will ignore errors after ready
    if [ -f ./medusa.failed ]; then
        echo "💀 FATAL: run-medusa.mjs failed"
        cleanup_and_exit 1
    fi
    sleep 2
    echo "Waiting for medusa to be ready"
done

node run-solver.mjs 2>&1 | while IFS= read -r line; do
    echo "$line"
    if echo "$line" | grep -q "Solver is running."; then
        echo "Solver is ready"
        touch ./solver.ready
    fi
    if echo "$line" | grep -q "Error"; then
        echo "Error occurred in run-solver.mjs"
        touch ./solver.failed
    fi
done &

while [ ! -f ./solver.ready ]; do # will ignore errors after ready
    if [ -f ./solver.failed ]; then
        echo "💀 FATAL: run-solver.mjs failed"
        cleanup_and_exit 1
    fi
    sleep 2
    echo "Waiting for solver to be ready"
done

timenow=$(date +%Y%m%d_%H%M%S)
npm run e2e 2>&1 | tee e2e_${timenow}.log
npm_exit_code=$?

if grep -Eqi "simulation error|rpc error|assertion failed" e2e_${timenow}.log; then
    echo "💀 FATAL: e2e tests failed: with simulation error, rpc error, or assertion failed"
    cleanup_and_exit 1
fi

if [ $npm_exit_code -ne 0 ]; then
    echo "💀 FATAL: e2e tests failed with exit code $npm_exit_code"
    cleanup_and_exit 1  
fi

echo "🎉 e2e tests passed"

cleanup_and_exit 0