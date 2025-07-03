import * as dotenv from "dotenv";
import { handler } from "./src/entry";

dotenv.config();

const main = () => {
  handler(null);
};

main();
