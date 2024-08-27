import { ref, Ref, unref, watch, ComputedRef, onMounted } from 'vue'
import useFilter from './useFilter'

function useSelector<T, U extends keyof T>(
  list: Ref<T[]> | ComputedRef<T[]>,
  key: U | any,
  active?: Ref<string>
) {
  active = active || ref<string>('')

  const { selectProps, filteredList, clearFilterStr } = useFilter(list, key)

  watch(
    () => unref(list) && unref(list).length,
    () => {
      selectProps.filterable =
        (unref(list) && unref(list).length > 5 && true) || false
    }
  )

  onMounted(() => {
    selectProps.filterable =
      (unref(list) && unref(list).length > 5 && true) || false
  })

  const chooseActive = (id: string, CustomRef?: any, key?: any) => {
    if (active) {
      active.value = id
    }
    if (CustomRef && key) {
      CustomRef[key] = id
    }
    clearFilterStr()
  }

  const selectEvents = {
    change: chooseActive,
    visibleChange: clearFilterStr,
  }

  return {
    active,
    chooseActive,
    selectProps,
    filteredList,
    selectEvents,
    clearFilterStr,
  }
}

export default useSelector
