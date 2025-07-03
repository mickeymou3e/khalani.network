import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { servicesSelectors } from '@store/services/services.selector'
import { BigDecimal } from '@utils/math'

export const useSwapFeePercentage = (): BigDecimal => {
  const [protocolSwapFeePercentage, setProtocolSwapFeePercentage] = useState(
    BigDecimal.from(0),
  )

  const protocolFeesCollector = useSelector(
    servicesSelectors.protocolFeesCollectorService,
  )

  useEffect(() => {
    const getProtocolFee = async () => {
      if (protocolFeesCollector) {
        const swapFeePercentage = await protocolFeesCollector.getProtocolFeePercentage()

        setProtocolSwapFeePercentage(swapFeePercentage)
      }
    }
    getProtocolFee()
  }, [protocolFeesCollector])

  return protocolSwapFeePercentage
}
