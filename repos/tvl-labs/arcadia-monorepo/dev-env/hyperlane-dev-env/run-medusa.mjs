import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getHubContractAddresses } from "./utilities.mjs";
import TOML from "@iarna/toml";
import { execa } from "execa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const hubInfo = getHubContractAddresses();
const MedusaKey = process.env.MEDUSA_KEY;

function writeMedusaConfig(hubInfo) {
  const medusaConfigPath = path.resolve(
    __dirname,
    "..",
    "..",
    "medusa",
    "config.toml"
  );
  const medusaConfigExamplePath = path.resolve(
    __dirname,
    "..",
    "..",
    "medusa",
    "config-example.toml"
  );
  try {
    const medusaConfig = fs.readFileSync(medusaConfigExamplePath, "utf8");
    const medusaConfigJson = TOML.parse(medusaConfig);

    medusaConfigJson["intent_book_address"] = hubInfo["intent_book_address"];
    medusaConfigJson["m_token_manager_address"] =
      hubInfo["m_token_manager_address"];
    medusaConfigJson["receipt_manager_address"] =
      hubInfo["receipt_manager_address"];
    medusaConfigJson["hub_publisher_address"] =
      hubInfo["hub_publisher_address"];
    medusaConfigJson["arcadia_url"] = "http://127.0.0.1:8545";
    medusaConfigJson["key"] = MedusaKey;

    fs.writeFileSync(medusaConfigPath, TOML.stringify(medusaConfigJson));
  } catch (error) {
    console.error("Error writing medusa config:", error);
  }
  const medusaPath = path.resolve(__dirname, "..", "..", "medusa");
  const freeSpaceDir = path.join(medusaPath, "free-space");

  if (!fs.existsSync(freeSpaceDir)) {
    fs.mkdirSync(freeSpaceDir, { recursive: true });
  }

  const freeSpaceFile = path.join(freeSpaceDir, "rdb");
  fs.writeFileSync(freeSpaceFile, "");
}

async function runMedusa() {
  const medusaPath = path.resolve(__dirname, "..", "..", "medusa");
  if (!fs.existsSync(path.join(medusaPath, "target", "release", "medusa-service"))) {
    await execa("cargo", ["build", "--release", "--all"], {
      cwd: medusaPath,
      stdio: "inherit",
      shell: true,
    });
  }
  const medusaProcess = await execa("./target/release/medusa-service", ["config.toml"], {
    cwd: medusaPath,
    stdio: "inherit",
    shell: true,
  });
  console.log("Medusa PID:", medusaProcess.pid);
  return medusaProcess;
}

writeMedusaConfig(hubInfo);
await runMedusa();
