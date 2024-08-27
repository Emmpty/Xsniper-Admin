import pingyinMatch from 'pinyin-match'

export interface IFilterListData {
  [index: string]: string | any
}

export function getFilteredList<
  T extends IFilterListData | string,
  U extends keyof T
>(list: T[], filterStr: string, key?: U) {
  if (!list || list.length === 0) {
    return []
  }
  if (!filterStr) {
    return list || []
  }

  return list.filter((item) => {
    if (filterStr === '') {
      return true
    }
    const filterItem = key ? item[key] : item
    return pingyinMatch.match(filterItem as string, filterStr)
  })
}
