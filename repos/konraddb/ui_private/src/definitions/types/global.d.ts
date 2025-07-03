export {};

declare global {
  type TFunc = (s: string, options?: object) => string;
  type NeutralObject = { [key: string]: unknown };
  type NeutralArrayOrObject = NeutralObject | NeutralArrayOrObject[];
}
