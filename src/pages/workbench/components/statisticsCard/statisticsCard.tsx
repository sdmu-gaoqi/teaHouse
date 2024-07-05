import { defineComponent, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { Empty, Segmented } from 'ant-design-vue'
import styles from './style.module.scss'
import { ProjectStatistics } from '@/hooks/useWorkBench'
import { isEmpty } from 'wa-utils'
import EmptyImg from '@/assets/empty.svg'

export default defineComponent({
  name: 'Echarts',
  props: ['data', 'request'],
  setup(props: { data: ProjectStatistics; request: any }, { expose }) {
    const type = ref('')
    const chartRef = ref<HTMLElement>()
    const chart = ref<echarts.ECharts>()
    onMounted(() => {
      var myChart = echarts.init(chartRef.value)
      chart.value = myChart
    })
    watch(
      () => props?.data,
      () => {
        const xs: string[] = []
        const ys: number[] = []
        const list = props?.data?.list?.sort(
          (a, b) => b?.totalPayPrice - a?.totalPayPrice
        )
        list?.forEach((i) => {
          xs.push(i?.projectName)
          ys.push(i?.totalPayPrice)
        })
        const option = {
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              end: 100 //初始化滚动条
            }
          ],
          label: {
            show: false,
            position: 'center'
          },
          legend: {
            selectedMode: false
          },
          grid: {
            left: '0px',
            right: '0px',
            bottom: '50px',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: xs
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: ys,
              type: 'bar',
              name: '消费次数',
              stack: 'Total',
              label: {
                show: true,
                position: 'top'
              },
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  //前四个参数用于配置渐变色的起止位置，这四个参数依次对应 右下左上 四个方位。也就是从右边开始顺时针方向。
                  //通过修改前4个参数，可以实现不同的渐变方向
                  /*第五个参数则是一个数组，用于配置颜色的渐变过程。
                    每项为一个对象，包含offset和color两个参数
                  */
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      //代表渐变色从正上方开始
                      offset: 0, //offset范围是0~1，用于表示位置，0是指0%处的颜色
                      color: '#fff'
                    }, //柱图渐变色
                    {
                      offset: 1, //指100%处的颜色
                      color: '#6102fd'
                    }
                  ]
                )
              }
            }
          ]
        }
        chart.value?.setOption(option)
      }
    )

    const setType = (v: string) => {
      type.value = v
    }

    expose({
      setType
    })

    return () => {
      return (
        <div class="flex">
          <div class={`w-[100%] text-[#080808] text-[16px] ${styles.body}`}>
            <div class={styles.chartTitle}>当天项目消费热度统计</div>
            <Segmented
              options={[
                { label: '全部', value: '' },
                { label: '会员', value: '1' },
                { label: '非会员', value: '0' },
                { label: '第三方', value: '2' }
              ]}
              value={type.value}
              onChange={(v) => {
                type.value = v as string
                props?.request({
                  settleType: v
                })
              }}
              class="mb-[20px]"
            />
            <div class={`relative ${styles.chart}`}>
              <div class="w-[100%] h-[429px] relative" ref={chartRef} />
              {isEmpty(props?.data?.list) && (
                <Empty
                  imageStyle={{
                    width: '300px',
                    height: '300px',
                    margin: '0 auto'
                  }}
                  class="absolute ml-[0] w-[100%] h-[100%] top-0 left-0 bottom-0 right-0 bg-[#fff]"
                  image={EmptyImg}
                  description="暂无记录~"
                />
              )}
            </div>
          </div>
        </div>
      )
    }
  }
})
