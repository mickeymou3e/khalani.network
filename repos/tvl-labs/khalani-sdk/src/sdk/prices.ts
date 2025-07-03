import axios from 'axios'
import config from '@config'
import { convertDecimalToIntegerDecimal } from '@utils/text'
import { PRICE_DECIMALS } from '@constants/Tokens'

export class Prices {
  constructor() {}

  async fetchPrice(symbol: string) {
    const apiUrl = `${config.api.dia.priceUrl}/${symbol}`

    try {
      const response = await axios.get(apiUrl)
      return convertDecimalToIntegerDecimal(
        response.data.Price.toString(),
        PRICE_DECIMALS,
      )
    } catch (error) {
      throw new Error('Error fetching Ethereum price')
    }
  }
}
