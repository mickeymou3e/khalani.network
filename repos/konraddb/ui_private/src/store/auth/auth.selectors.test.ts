import { createMockAuthStore } from "@/definitions/__mocks__";
import {
  selectAuthErrorCode,
  selectCsrfToken,
  selectIsNotValidLogin,
  selectIsTwoFactorAuth,
  selectIsValidLogin,
  selectLoginToken,
  selectWsToken,
} from "@/store/auth/auth.selectors";
import { RootState } from "@/store/store";

describe("auth selectors", () => {
  const createStore = ({
    csrfToken = "",
    loginToken = "",
    wsToken = "",
    isFullyLoggedIn = false,
  }: any) =>
    ({
      auth: createMockAuthStore({
        csrfToken,
        loginToken,
        wsToken,
        errorCode: 1,
        isFullyLoggedIn,
      }),
    } as RootState);

  describe("token selectors", () => {
    const store = createStore({
      csrfToken: "csrf token",
      loginToken: "login token",
      wsToken: "ws token",
    });

    it("should return csrfToken", () => {
      const result = selectCsrfToken(store);

      expect(result).toEqual("csrf token");
    });

    it("should return loginToken", () => {
      const result = selectLoginToken(store);

      expect(result).toEqual("login token");
    });

    it("should return wsToken", () => {
      const result = selectWsToken(store);

      expect(result).toEqual("ws token");
    });

    it("should error code", () => {
      const result = selectAuthErrorCode(store);

      expect(result).toEqual(1);
    });
  });

  describe("isTwoFactorAuth selector", () => {
    it("should return true if csrfToken and loginToken are not empty", () => {
      const store = createStore({
        csrfToken: "csrf token",
        loginToken: "login token",
      });

      const result = selectIsTwoFactorAuth(store);

      expect(result).toEqual(true);
    });

    it("should return false if csrfToken is empty", () => {
      const store = createStore({
        loginToken: "login token",
      });

      const result = selectIsTwoFactorAuth(store);

      expect(result).toEqual(false);
    });
  });

  describe("IsNotValidLogin selector", () => {
    it("should return true if csrfToken and wsToken are not empty", () => {
      const store = createStore({
        csrfToken: "csrf token",
        wsToken: "ws token",
      });

      const result = selectIsNotValidLogin(store);

      expect(result).toEqual(true);
    });

    it("should return false if csrfToken is empty", () => {
      const store = createStore({
        wsToken: "ws token",
      });

      const result = selectIsNotValidLogin(store);

      expect(result).toEqual(false);
    });
  });

  describe("IsFullyLoggedIn selector", () => {
    it("should return true if csrfToken and wsToken are not empty and the flag is true", () => {
      const store = createStore({
        csrfToken: "csrf token",
        wsToken: "ws token",
        isFullyLoggedIn: true,
      });

      const result = selectIsValidLogin(store);

      expect(result).toEqual(true);
    });

    it("should return false if the flag is false", () => {
      const store = createStore({
        csrfToken: "csrf token",
        wsToken: "ws token",
      });

      const result = selectIsValidLogin(store);

      expect(result).toEqual(false);
    });
  });
});
