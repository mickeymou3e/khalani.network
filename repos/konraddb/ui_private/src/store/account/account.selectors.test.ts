import { userProfileMock } from "@/definitions/__mocks__";
import {
  selectNeutralClient,
  selectNeutralClientCode,
  selectNeutralCustomerCode,
} from "@/store/account/account.selectors";

describe("account selectors", () => {
  test("should return client details", () => {
    const result = selectNeutralClient.resultFunc(userProfileMock);

    expect(result).toEqual(userProfileMock.client);
  });

  test("should return client code", () => {
    const result = selectNeutralClientCode.resultFunc(userProfileMock.client);

    expect(result).toEqual(userProfileMock.client.code);
  });

  test("should return neutral customer code", () => {
    const result = selectNeutralCustomerCode.resultFunc(userProfileMock);

    expect(result).toEqual(userProfileMock.customer_code);
  });
});
