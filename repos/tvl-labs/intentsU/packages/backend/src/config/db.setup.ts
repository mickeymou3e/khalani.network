import { ServerApiVersion } from "mongodb";

export const uri =
  "mongodb+srv://intentsU-admin:1A5aTJNogL0sNSEF@intentsu.msq1g8u.mongodb.net/?retryWrites=true&w=majority&appName=intentsU";
export const serverApi = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};
