import { useEffect, useState } from 'react'

import { IListItem } from './SearchList.types'

export const useSearch = ({
  items,
  initSearchText = '',
}: {
  items: IListItem[]
  initSearchText?: string
}): {
  items: IListItem[]
  setSearchText: (searchText: string) => void
  searchText?: string
} => {
  const [searchText, setSearchText] = useState(initSearchText)
  const [searched, setSearched] = useState<IListItem[]>(items)

  useEffect(() => {
    const searched = items.filter(
      ({ text, symbol }) =>
        text.toUpperCase().startsWith(searchText.toUpperCase()) ||
        (symbol && symbol.toUpperCase().startsWith(searchText.toUpperCase())),
    )
    setSearched(searched)
  }, [searchText, items])

  return { items: searched, setSearchText, searchText }
}
