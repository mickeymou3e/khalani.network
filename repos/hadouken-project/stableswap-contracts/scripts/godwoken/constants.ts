import path, { dirname } from 'path'

export const PROJECT_ROOT = path.join(__dirname, '../..')

export const SRC_DIR = path.join(PROJECT_ROOT, 'src')
export const CONTRACTS_DIR = path.join(PROJECT_ROOT, 'contracts')
export const COMPILED_CONTRACTS_DIR = path.join(PROJECT_ROOT, 'build', 'contracts')
