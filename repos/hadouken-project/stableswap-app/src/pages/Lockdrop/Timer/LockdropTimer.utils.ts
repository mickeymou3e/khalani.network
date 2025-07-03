export const getCurrentLockdropDay = (
  remainingDay: number,
): string | undefined => {
  switch (remainingDay) {
    case 2:
      return '1'
    case 1:
      return '2'
    case 0:
      return '3'
    default:
      return undefined
  }
}
