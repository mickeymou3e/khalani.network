export const createLabelValue = (t: TFunc, key: string, namespace: string) => ({
  label: t(`${namespace}:${key}`),
  value: key,
});

export const createTitleKey = (t: TFunc, key: string, namespace: string) => ({
  title: t(`${namespace}:${key}`),
  key,
});
