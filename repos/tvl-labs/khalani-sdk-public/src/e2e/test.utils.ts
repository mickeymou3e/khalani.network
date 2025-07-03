export const TEST_ACTION_TIMEOUT = 5 * 60 * 1000
export const TEST_ACTION_CHECK_INTERVAL = 5000

export function increaseJestTimeout() {
  jest.setTimeout(10 * 60 * 1000)
}

export function waitForCondition(
  condition: () => Promise<boolean>,
  timeout: number = TEST_ACTION_TIMEOUT,
  interval: number = TEST_ACTION_CHECK_INTERVAL,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const checkCondition = async () => {
      if (await condition()) {
        resolve()
      } else if (Date.now() - start < timeout) {
        setTimeout(checkCondition, interval)
      } else {
        reject(new Error('Condition check timed out.'))
      }
    }

    const start = Date.now()
    setTimeout(checkCondition, 100)
  })
}
