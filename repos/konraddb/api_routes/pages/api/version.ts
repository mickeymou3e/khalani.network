import type { NextApiRequest, NextApiResponse } from "next";

const getBuildId = async () => {
  try {
    const getBuildId = require("next-build-id");
    return await (getBuildId() as Promise<string>);
  } catch (error) {
    console.error("Error reading build ID:", error);
    return "unknown";
  }
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<{
    buildId: string;
  }>
) {
  try {
    const buildId = await getBuildId();
    res.status(200).json({ buildId });
  } catch (error) {
    console.error("Error reading build ID:", error);
  }
}
