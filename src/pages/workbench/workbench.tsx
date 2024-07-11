import { defineComponent, ref } from 'vue'
import styles from './style.module.scss'
import BaseCard from './components/baseCard/baseCard'
import Card from './components/card/card'
import EngineerCard from './components/engineerCard/engineerCard'
import { useRouter } from 'vue-router'
import StatisticsCard from './components/statisticsCard/statisticsCard'
import employee from '@/servers/employee'
import { useRequest } from 'vue-hooks-plus'
import work1 from '@/assets/work1.png'
import work2 from '@/assets/work2.png'
import work3 from '@/assets/work3.png'
import work4 from '@/assets/work4.png'
import right1 from '@/assets/right1.png'
import right2 from '@/assets/right2.png'
import right3 from '@/assets/right3.png'
import right4 from '@/assets/right4.png'
import useWorkBench, { Turnover } from '@/hooks/useWorkBench'
import { Empty, Space, Spin, Tooltip } from 'ant-design-vue'
import { formatMoney } from '@/utils'
import { isEmpty } from 'wa-utils'
import EmptyImg from '@/assets/empty.svg'
import dayjs from 'dayjs'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'

const menuMap = [
  {
    icon: right3,
    title: '创建订单',
    path: '/order/create',
    bg: '#E1EEFD',
    state: {
      create: true
    }
  },
  {
    icon: right2,
    title: '会员充值',
    path: '/member/list',
    bg: '#FDF6DA'
  },
  {
    icon: right1,
    title: '创建会员',
    path: '/member/add',
    bg: '#FCECE9'
  },
  {
    icon: right4,
    title: '发布动态',
    path: '/stores/updates/add',
    bg: '#EAF6ED'
  }
]

const Workbench = defineComponent({
  // engineerList
  setup() {
    const { loading, data, getProjectStatistic, getTurnover, getMember } =
      useWorkBench()
    const { data: engineerList } = useRequest(employee.engineerList)
    const router = useRouter()
    const statisticsRef = ref()
    const turnoverMap: {
      bg: string
      icon: any
      title: string
      key: keyof Turnover
    }[] = [
      {
        bg: 'linear-gradient(137deg, #F0ECFF 0%, #F9F3FF 100%)',
        icon: work1,
        title: '日营业额（元）',
        key: 'totalPayPrice'
      },
      {
        bg: 'linear-gradient(137deg, #D9E2FF 0%, #F9F3FF 100%)',
        icon: work2,
        title: '订单扫码支付',
        key: 'onlinePayPrice'
      },
      {
        bg: 'linear-gradient(137deg, #ECFFF7 0%, #F9F3FF 100%)',
        icon: work3,
        title: '订单现金收入',
        key: 'offlinePayPrice'
      },
      {
        bg: 'linear-gradient(137deg, #feffec 0%, #f9f3ff 100%)',
        icon: work4,
        title: '订单其他方式收入',
        key: 'otherPayPrice'
      },
      {
        bg: 'linear-gradient(137deg, #FFF4EC 0%, #F9F3FF 100%)',
        icon: work4,
        title: '订单数量',
        key: 'orderCnt'
      }
    ]

    return () => {
      return (
        <div class="overflow-y-hidden">
          <Spin spinning={loading?.value}>
            <div class={styles.body}>
              <div class={styles.left}>
                <Card
                  title={`日营业额(${dayjs(new Date()).format('YYYY-MM-DD')})`}
                  contentClass={styles.baseGroup}
                  showDate
                  now
                  time={data?.value?.turnover?.time}
                  request={getTurnover}
                >
                  {turnoverMap.map((item) => (
                    <BaseCard
                      id={item.key}
                      key={item.key}
                      title={item.title}
                      allMoney="15500"
                      icon={item.icon}
                      bg={item.bg}
                      value={data?.value?.turnover?.[item?.key]}
                      isCount={item.key === 'orderCnt'}
                    />
                  ))}
                </Card>
                <Card
                  title="数据统计"
                  showDate
                  class={styles.chartCard}
                  now
                  time={data?.value?.projectStatistics?.time}
                  request={() => {
                    getProjectStatistic()
                    statisticsRef?.value?.setType('')
                  }}
                >
                  <StatisticsCard
                    data={data?.value?.projectStatistics}
                    request={getProjectStatistic}
                    ref={statisticsRef}
                  />
                </Card>
              </div>
              <div class={styles.right}>
                <Card
                  class={`text-[#080808] ${styles.cardBody}`}
                  title={`顾客消费情况(${dayjs(new Date()).format(
                    'YYYY-MM-DD'
                  )})`}
                  contentClass="pt-0 pb-0 pl-0 pr-0"
                  showDate
                  now
                  time={data?.value?.memberInfo?.time}
                  request={() => {
                    getMember()
                  }}
                >
                  <div class="flex items-center justify-between">
                    <div
                      class={styles.card}
                      style={{
                        background:
                          'linear-gradient(135deg, #F0ECFF 0%, #B5A4F9 100%, #7F64F3 100%)'
                      }}
                    >
                      <div class={styles.title}>会员</div>
                      <div class="text-[12px]">
                        充值金额:
                        {formatMoney(
                          data?.value?.memberInfo?.totalRechargePrice
                        )}
                      </div>
                      <div class="text-[12px]">
                        消费金额:
                        {formatMoney(data?.value?.memberInfo?.totalPayPrice1)}
                        <Tooltip title="会员消费金额：计算会员折扣卡消费金额">
                          <QuestionCircleOutlined
                            style={{ marginLeft: '10px' }}
                          />
                        </Tooltip>
                      </div>
                      <div class="text-[12px]">
                        退卡金额:
                        {formatMoney(data?.value?.memberInfo?.totalExitPrice)}
                      </div>
                      <div class="text-[12px]">
                        顾客数量:
                        {data?.value?.memberInfo?.customNum1}
                      </div>
                    </div>
                    <div
                      class={styles.card}
                      style={{
                        background:
                          'linear-gradient(136deg, #f6feef 0%, #bee7c6 100%, #c5e2b5 100%)'
                      }}
                    >
                      <div
                        class={`${styles.title} !text-[#629d43] text-[12px]`}
                      >
                        非会员
                      </div>
                      <div class={`${styles.desc} !text-[#629d43] text-left`}>
                        消费金额:
                        {formatMoney(data?.value?.memberInfo?.totalPayPrice0)}
                      </div>
                      <div class={`${styles.desc} !text-[#629d43] text-left`}>
                        顾客数量:
                        {data?.value?.memberInfo?.customNum0}
                      </div>
                    </div>
                    <div
                      class={styles.card}
                      style={{
                        background:
                          'linear-gradient(136deg, #FEF8EF 0%, #E7D6BE 100%, #E2CFB5 100%)'
                      }}
                    >
                      <div class={`${styles.title} !text-[#AA7D3A]`}>
                        第三方平台
                      </div>
                      <div
                        class={`${styles.desc} !text-[#AA7D3A] text-left text-[12px]`}
                      >
                        消费金额:
                        {formatMoney(data?.value?.memberInfo?.totalPayPrice2)}
                      </div>
                      <div
                        class={`${styles.desc} !text-[#AA7D3A] text-left text-[12px]`}
                      >
                        顾客数量:
                        {data?.value?.memberInfo?.customNum2}
                      </div>
                    </div>
                  </div>
                </Card>
                <div class="flex justify-between items-center flex-wrap px-[20px] pb-[14px]">
                  {menuMap.map((item, index) => (
                    <div
                      class={`cursor-pointer hover:shadow-lg ${styles.menuItem}`}
                      style={{
                        color: '#fff',
                        background: item.bg,
                        padding: '10px',
                        textAlign: 'center',
                        ...(index > 1 && {
                          marginBottom: 0
                        })
                      }}
                      onClick={() => {
                        if (!item.path) {
                          router.push('/member/list')
                          return
                        }
                        router.push({
                          path: item.path
                        })
                        if (item.state) {
                          ;(window as any).routerState = item.state
                        }
                      }}
                    >
                      <img src={item.icon} class="w-[30px]" />
                      <div class="text-[#414141]">{item.title}</div>
                    </div>
                  ))}
                </div>
                <Card title="顾客预约">
                  <div class={`${styles.news} flex`}>
                    暂无顾客预约信息
                    {/* <div>2024.04.10 12:00~13:00</div>
                  <div class="px-[5px]">XXX</div>
                  <div>电话预约</div>
                  <div class="px-[5px]">预约XX技师做中医推拿</div>
                  <span class="text-primary cursor-pointer">到达</span>
                  <span class="text-yellow-500 cursor-pointer mx-[4px]">
                    延迟
                  </span>
                  <span class="text-red-500 cursor-pointer">取消</span> */}
                  </div>
                </Card>
                <Card
                  title="技师栏"
                  contentClass={styles.engineerGroup}
                  class={styles.enCard}
                >
                  {isEmpty(engineerList) && (
                    <Empty
                      image={EmptyImg}
                      description="暂无技师~"
                      class="ml-[0] w-[100%] h-[100%] bg-[#fff]"
                    />
                  )}
                  {console.log(engineerList, 'engineerList')}
                  {(engineerList as any).value?.rows?.map((item: any) => (
                    <EngineerCard
                      nickName={item.nickName}
                      remark={item.remark}
                      userId={String(item?.userId)}
                      jsInfo={data?.value?.jsInfo}
                    />
                  ))}
                </Card>
              </div>
            </div>
          </Spin>
        </div>
      )
    }
  }
})

export default Workbench
