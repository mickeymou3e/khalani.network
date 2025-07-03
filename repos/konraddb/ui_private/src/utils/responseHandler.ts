import { ResponseStatus } from "@/services/api.types";

export const signupResponseHandler = (response: any) => {
  // Send Signup Credentials
  if (response?.error?.data?.data === "Email already exists.") {
    return {
      status: ResponseStatus.ERROR,
      formattedMessage: ":emailAlreadyInUse",
    };
  }
  if (response?.data?.status === "Success") {
    return {
      status: ResponseStatus.SUCCESS,
      data: response?.data?.data,
    };
  }

  // If nothing matches
  return {
    status: "",
    formattedMessage: ":somethingWentWrong",
  };
};
