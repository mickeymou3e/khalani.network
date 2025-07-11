const { main } = require("./approve-wasm-multisig");

const SUDO_SIGNATORIES = [
  "5FPJHiZnj5wk2hGxer7xwBJi91WNwsssYeVspq7Sd9mhwyxt", // CARROT
  "5FyFcPnN8LrzFVtW1j8TPC3CpoK4DhuFYHCPtyffdgA7or29", // VUNE
  "5GmX9ZESxY6b8N2LxWKnaYH3VmbmPRjM4iu5f8oRs78R2Hzi", // ALA
];
const SUDO_THRESHOLD = 2; // 2 of 3

main(SUDO_SIGNATORIES, SUDO_THRESHOLD).catch((error) => {
  console.error(error.stack);
  process.exit(1);
});
