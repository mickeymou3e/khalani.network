const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1)
const capitalizeSentence = (value: string): string => {
  const words = value.split('-').map((word) => capitalize(word))

  return words.join(' ')
}
export const getPageName = (path: string): string =>
  path?.length > 0 ? capitalizeSentence(path?.split('/')[1]) : 'Lending'
