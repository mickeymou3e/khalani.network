import { useState, useEffect } from 'react'

import { ListItem } from './SearchList.types'

export const useSearch = ({
  items,
  initSearchText = '',
}: {
  items: ListItem[]
  initSearchText?: string
}): [ListItem[], (searchText: string) => void] => {
  const [searchText, setSearchText] = useState(initSearchText)
  const [searched, setSearched] = useState<ListItem[]>(items)

  useEffect(() => {
    const searched = items.filter(({ text }) =>
      text.toUpperCase().startsWith(searchText.toUpperCase()),
    )
    setSearched(searched)
  }, [searchText, items])

  return [searched, setSearchText]
}
