import { promises as fs } from 'fs';
import path from 'path';
import prompts from 'prompts';
import { Cli } from '../../types';

export const templateFactoryCreateCli: Cli = async (cliProps) => {
  const allFiles = await fs.readdir('../../pools', { withFileTypes: true });
  const directories = allFiles.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

  console.log(directories);
};
