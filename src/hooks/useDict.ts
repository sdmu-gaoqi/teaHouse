import { dictDetailListRequest } from '@/service/dictData'
import { Dict, ReturnDictDetailList } from '@/service/typing'
import { onMounted, ref } from 'vue'

const useDict = (dictType: Dict) => {
  const dictLists = ref<ReturnDictDetailList['data']>([])
  const dictMaps =
    ref<Record<Dict, Record<string, ReturnDictDetailList['data'][0]>>>()

  onMounted(async () => {
    if (dictMaps?.value?.[dictType]) {
      return
    }
    const res = await dictDetailListRequest({ dictType })
    dictLists.value = res?.data
    dictMaps.value = {
      ...(dictMaps.value || {}),
      [dictType]: Object.fromEntries(res?.data?.map((i) => [i.value, i]))
    }
  })

  return {
    dictLists,
    dictMaps
  }
}

export default useDict
