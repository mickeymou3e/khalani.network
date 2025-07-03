import { ApiRoutes } from "@/definitions/config";
import { RequestMethods } from "@/definitions/types";

export const downloadCSVFile = async (
  bearerToken: string,
  fileName: string
) => {
  const endpoint = ApiRoutes.DOWNLOAD_HISTORY;
  const url = `${process.env.NEXT_PUBLIC_JASMINE_NEUTRAL_REST_URL}${endpoint}`;

  return fetch(url, {
    method: RequestMethods.GET,
    headers: {
      authorization: `Bearer ${bearerToken}`,
    },
    credentials: "include",
  })
    .then((resp) => resp.blob())
    .then((blob) => {
      const anchor = document.createElement("a");
      anchor.href = URL.createObjectURL(blob);
      anchor.download = fileName;

      anchor.click();

      URL.revokeObjectURL(url);
    })
    .catch((err: any) => {
      console.log("Unable to fetch history", err);
    });
};
