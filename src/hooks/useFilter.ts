import { Ref, ref, computed, ComputedRef } from 'vue'
import { getFilteredList } from '@/utils/filter'

export interface IFilterListData {
  [index: string]: string | any
}

function useFilter<T, U extends keyof T>(
  list: Ref<T[]> | ComputedRef<T[]> | IFilterListData,
  key: U | any
) {
  const filterStr = ref<string>('')

  const filterMethod = (val: string) => {
    filterStr.value = val
  }

  const selectProps: {
    filterable: boolean | Ref<boolean>
    filterMethod: (val: string) => void
  } = {
    filterable: true,
    filterMethod: filterMethod,
  }

  const filteredList = computed(() => {
    if (filterStr.value) {
      return getFilteredList(list.value, filterStr.value, key)
    } else {
      return list.value
    }
  })

  const clearFilterStr = () => {
    filterStr.value = ''
  }

  return {
    selectProps,
    filteredList,
    clearFilterStr,
  }
}

export default useFilter
