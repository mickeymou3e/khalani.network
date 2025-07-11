const path = require('path');
const fs = require('fs');

// Function to load env file
function loadEnvFile(filePath) {
    const envConfig = {};
    const envContent = fs.readFileSync(filePath, 'utf-8').trim().split('\n');

    for (const line of envContent) {
        // Skip comments and empty lines
        if (!line || line.startsWith('#')) continue;

        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('='); // Rejoin in case value contains =
        if (key && value) {
            envConfig[key.trim()] = value.trim();
        }
    }
    return envConfig;
}

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '.env');
const customEnv = loadEnvFile(envPath);

// Generate random suffix for project name
const RANDOM_SUFFIX = require('child_process')
    .execSync("cat /dev/urandom | tr -dc 'a-z0-9' | fold -w 4 | head -n 1")
    .toString()
    .trim();
const PROJECT_NAME = `test_${RANDOM_SUFFIX}`;

// Merge process.env with custom env, giving priority to custom env
const mergedEnv = {
    ...process.env,
    ...customEnv,
    PROJECT_NAME: PROJECT_NAME
};

module.exports = {
    apps: [
        // {
        //     name: "TM1",
        //     script: "neurons/miner.py",
        //     interpreter: "python3",
        //     env: mergedEnv,
        //     args: `--wallet.name Bistro --wallet.hotkey M1 --device cuda:3 --subtensor.network ws://127.0.0.1:9945 --netuid 1 --use_wandb --project "${PROJECT_NAME}"`
        // },
        // {
        //     name: "TM2",
        //     script: "neurons/miner.py",
        //     interpreter: "python3",
        //     env: mergedEnv,
        //     args: `--wallet.name Bistro --wallet.hotkey M2 --device cuda:1 --subtensor.network ws://127.0.0.1:9945 --netuid 1 --use_wandb --project "${PROJECT_NAME}"`
        // },
        // {
        //     name: "TV1",
        //     script: "neurons/validator.py",
        //     interpreter: "python3",
        //     env: mergedEnv,
        //     args: `--wallet.name Bistro --wallet.hotkey V1 --device cuda:2 --subtensor.network ws://127.0.0.1:9945 --netuid 1 --use_wandb --project "${PROJECT_NAME}" --store-gathers`
        // },
        {
            name: "TA1",
            script: "scripts/analyser.py",
            interpreter: "python3",
            env: mergedEnv,
            args: `--device cuda:4`
        }
    ]
} 