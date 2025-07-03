import { program } from "commander";

import {
  confirmCorrectWalletCommand,
  selectConfigCommand,
} from "./commands/env";

import "dotenv/config";
import { contractsCli } from "./commands/contracts";
import { Config, ScriptRunEnvironment } from "./types";

program
  .name("cli")
  .description("CLI to manage Hadoken Lending contracts and config")
  .action(async () => {
    const config = await selectConfigCommand();
    const scriptRunEnvironment = await confirmCorrectWalletCommand(
      config as Config
    );

    await contractsCli({
      environment: scriptRunEnvironment as ScriptRunEnvironment,
    });
  });

program.parse();
