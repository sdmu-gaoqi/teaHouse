import { dictDetailListRequest } from '@/service/dictData'
import { Dict, ReturnDictDetailList } from '@/service/typing'
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const useDict = (dictType: Dict) => {
  const store = useStore()
  const { dictMaps } = store.state.dict
  const dictLists = ref<ReturnDictDetailList['data']>(
    Object.values(dictMaps?.[dictType] || {})
  )

  onMounted(async () => {
    if (dictMaps?.[dictType]) {
      return
    }
    const res = await dictDetailListRequest({ dictType })
    dictLists.value = res?.data
    store.dispatch('dict/setDict', {
      data: {
        [dictType]: Object.fromEntries(res?.data?.map((i) => [i.value, i]))
      }
    })
  })

  return {
    dictLists,
    dictMaps
  }
}

export default useDict
