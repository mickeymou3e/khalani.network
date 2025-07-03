export const evaluate = <T>(
  ...statements: [boolean | string | number, unknown][]
) => {
  const reversed = [...statements].reverse();
  const item = reversed.find(([condition]) => condition);
  return (item?.[1] as T) ?? undefined;
};
