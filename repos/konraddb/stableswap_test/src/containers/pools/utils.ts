import { useLocation } from 'react-router-dom'

export const useGetPoolIdFromSlug = (): string => {
  const location = useLocation()
  const poolId = location.pathname.split('/')[2]

  return poolId
}

export const setPoolIdToSlug = (slug: string, poolId: string) =>
  slug.replace(':poolId', poolId)
