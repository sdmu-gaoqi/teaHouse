import { defineComponent, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import { Segmented } from 'ant-design-vue'
import styles from './style.module.scss'
import { ProjectStatistics } from '@/hooks/useWorkBench'

export default defineComponent({
  name: 'Echarts',
  props: ['data', 'request'],
  setup(props: { data: ProjectStatistics; request: any }) {
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
          legend: {},
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
              label: {
                show: true,
                position: 'top'
              }
            }
          ]
        }
        chart.value?.setOption(option)
      }
    )

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
            <div class="w-[100%] h-[509px]" ref={chartRef} />
          </div>
        </div>
      )
    }
  }
})
