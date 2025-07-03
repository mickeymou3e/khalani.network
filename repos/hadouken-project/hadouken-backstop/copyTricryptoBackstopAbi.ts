import { abi as TriCryptoBackstop_ABI } from "./artifacts/contracts/TriCryptoBackstop.sol/TriCryptoBackstop.json";
import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "./src/abi/TriCryptoBackstop.json");

const destinationFile = path.dirname(filePath);

if (!fs.existsSync(destinationFile)) {
  fs.mkdirSync(destinationFile, { recursive: true });
}

fs.writeFileSync(filePath, JSON.stringify(TriCryptoBackstop_ABI, null, 2));

console.log("ABI data written to src/abi/TriCryptoBackstop.json successfully.");
