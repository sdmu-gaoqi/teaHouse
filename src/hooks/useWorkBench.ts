import { request } from 'store-request'
import { onMounted, ref } from 'vue'

export type ProjectStatistics = {
  time: number
  list: {
    projectCnt: number
    projectId: number
    projectName: string
    totalPayPrice: number
    time: number
  }[]
}

export type Turnover = {
  /**
   * 离线支付价格
   * */
  offlinePayPrice: number
  /**
   * 在线支付价格
   * */
  onlinePayPrice: number
  /**
   * 订单数量
   * */
  orderCnt: number
  /**
   * 其他支付价格
   * */
  otherPayPrice: number
  /**
   * 总支付价格
   * */
  totalPayPrice: number
  time: number
}

const useWorkBench = (props?: { manaul: boolean }) => {
  const loading = ref(true)
  const data = ref({
    projectStatistics: {} as ProjectStatistics,
    turnover: {} as Turnover
  })

  const getProjectStatistic = (params?: any) => {
    loading.value = true
    request
      .request({
        url: '/dashboard/getProjectStatistic',
        method: 'get',
        params
      })
      .then((res: any) => {
        data.value.projectStatistics = {
          list: res?.data as ProjectStatistics['list'],
          time: +new Date()
        } as ProjectStatistics
      })
      .finally(() => {
        loading.value = false
      })
  }

  const getTurnover = () => {
    loading.value = true
    request
      .request({
        url: '/dashboard/getTodayProfit',
        method: 'get'
      })
      .then((res: any) => {
        data.value.turnover = {
          ...(res?.data as Turnover),
          time: +new Date()
        } as Turnover
      })
      .finally(() => {
        loading.value = false
      })
  }

  onMounted(async () => {
    if (props?.manaul) {
      return
    }
    const requests = [
      // 获取当日项目统计
      request
        .request({
          url: '/dashboard/getProjectStatistic',
          method: 'get'
        })
        .catch((err) => Promise.resolve({})),
      // 获取当天营业额
      request
        .request({
          url: '/dashboard/getTodayProfit',
          method: 'get'
        })
        .catch((err) => Promise.resolve({}))
    ]
    const [projectStatistics, turnover] = await Promise.all(requests)
    loading.value = false
    data.value = {
      projectStatistics: {
        list: (projectStatistics as any)?.data as ProjectStatistics['list'],
        time: +new Date()
      } as ProjectStatistics,
      turnover: {
        ...((turnover as any)?.data as Turnover),
        time: +new Date()
      } as Turnover
    }
  })

  return {
    loading,
    data,
    getProjectStatistic,
    getTurnover
  }
}

export default useWorkBench
