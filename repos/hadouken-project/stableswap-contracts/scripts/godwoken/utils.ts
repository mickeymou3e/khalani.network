import fs from 'fs';
import path from 'path'

export function packNumbers(numbers: number[]) {
  let packed = 0;
  for (let [index, element] of numbers.entries()) {
    packed += element << (index * 8);
  }
  return packed;
}

export const getData = <T>(path: string): T | null => {
  let data: T | null = null;

  if (fs.existsSync(path)) {
    data = JSON.parse(
      fs.readFileSync(path, "utf8")
    )
  }

  return data
}

export const getDataPath = (contractPath: string) => {
  const dataPath = path.join(
    contractPath,
    `data.json`
  )

  return dataPath
};

export const getDeploymentDataPath = (contractPath: string, network: string) => {
  const deploymentDataPath = path.join(
    contractPath,
    `deployment.${network}.json`
  )

  return deploymentDataPath
};


export const writeData = <T>(path: string, data: Partial<T>) => {

  fs.writeFileSync(
    path,
    JSON.stringify(data, null, 2)
  )

  return data;
}


export const overrideData = <T>(
  path: string,
  dataToOverride: Partial<T>
) => {
  const data: T | null = getData<T>(path);

  let overriddenData = dataToOverride
  if (data) {
    overriddenData = {
      ...data,
      ...dataToOverride,
    };
  }

  writeData<T>(path, overriddenData)

  return overriddenData;
}

export async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
