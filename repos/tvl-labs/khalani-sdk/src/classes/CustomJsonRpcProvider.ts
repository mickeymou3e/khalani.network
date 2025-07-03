import { JsonRpcProvider, Network } from 'ethers-v6'

export class CustomJsonRpcProvider extends JsonRpcProvider {
  private timeout: number
  private headers: Record<string, string>

  constructor(
    url: string,
    network?: Network,
    timeout = 10000,
    headers: Record<string, string> = {},
  ) {
    super(url, network)
    this.timeout = timeout
    this.headers = { 'Content-Type': 'application/json', ...headers }
  }

  async send(method: string, params: any[]): Promise<any> {
    // Modify 'data' to 'input' in eth_call requests
    if (method === 'eth_call' && params.length > 0 && params[0]?.data) {
      params[0].input = params[0].data
      delete params[0].data
    }

    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), this.timeout)

    // Store the original fetch
    const originalFetch = globalThis.fetch

    // Create a Proxy fetch that adds headers and timeout handling
    const modifiedFetch = new Proxy(fetch, {
      apply: (target, thisArg, argumentsList) => {
        const [resource, options] = argumentsList

        // Customize headers and add abort signal
        const modifiedOptions = {
          ...options,
          headers: { ...this.headers, ...(options?.headers || {}) },
          signal: controller.signal,
        }

        return target.call(thisArg, resource, modifiedOptions)
      },
    })

    try {
      // Override global fetch with the modified fetch
      globalThis.fetch = modifiedFetch
      return await super.send(method, params)
    } finally {
      // Restore original fetch and clear timeout
      globalThis.fetch = originalFetch
      clearTimeout(id)
    }
  }
}
