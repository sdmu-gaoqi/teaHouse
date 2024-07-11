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

export type Js = {
  /**
   * id
   * */
  operateUserId: number
  /**
   * 时长
   * */
  totalServiceNum: number
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

export type MemberInfo = {
  cnt: 1
  /**
   * 非会员客数
   * */
  customNum0: 0
  /**
   * 会员客数
   * */
  customNum1: 1
  /**
   * 第三方客数
   * */
  customNum2: 0
  /**
   * 会员退卡金额
   * */
  totalExitPrice: 0
  /**
   * 非会员消费总金额
   * */
  totalPayPrice0: 0
  /**
   * 会员消费总金额
   * */
  totalPayPrice1: 600
  /**
   * 第三方消费总金额
   * */
  totalPayPrice2: 0
  /**
   * 会员充值总金额
   * */
  totalRechargePrice: 0
  time: number
}

const useWorkBench = (props?: { manaul: boolean }) => {
  const loading = ref(true)
  const data = ref({
    projectStatistics: {} as ProjectStatistics,
    turnover: {} as Turnover,
    memberInfo: {} as MemberInfo,
    jsInfo: {} as Record<string, Js>
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

  const getMember = () => {
    loading.value = true
    request
      .request({
        url: '/dashboard/getTodayMemberStatistic',
        method: 'get'
      })
      .then((res: any) => {
        data.value.memberInfo = {
          ...(res?.data as MemberInfo),
          time: +new Date()
        } as MemberInfo
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
        .catch((err) => Promise.resolve({})),
      // 获取当日顾客数量
      request
        .request({
          url: '/dashboard/getTodayMemberStatistic',
          method: 'get'
        })
        .catch((err) => Promise.resolve({})),
      request
        .request({
          url: '/dashboard/getOperateUserStatistic',
          method: 'get'
        })
        .catch((err) => Promise.resolve({}))
    ]
    const [projectStatistics, turnover, memberInfo, jsInfo] =
      await Promise.all(requests)
    loading.value = false
    console.log(jsInfo, 'jsInfo')
    data.value = {
      projectStatistics: {
        list: (projectStatistics as any)?.data as ProjectStatistics['list'],
        time: +new Date()
      } as ProjectStatistics,
      turnover: {
        ...((turnover as any)?.data as Turnover),
        time: +new Date()
      } as Turnover,
      memberInfo: {
        ...((memberInfo as any)?.data as MemberInfo),
        time: +new Date()
      } as MemberInfo,
      jsInfo: Object.fromEntries(
        (jsInfo as any)?.data?.map((i: any) => [
          i?.operateUserId,
          i?.totalServiceNum
        ])
      ) as Record<string, Js>
    }
  })

  return {
    loading,
    data,
    getProjectStatistic,
    getTurnover,
    getMember
  }
}

export default useWorkBench
