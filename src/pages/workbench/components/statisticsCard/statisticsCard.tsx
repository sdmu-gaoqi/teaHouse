import { defineComponent, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import { Button, Segmented } from 'ant-design-vue'
import styles from './style.module.scss'

export default defineComponent({
  name: 'Echarts',
  setup() {
    const type = ref('')
    const chartRef = ref<HTMLElement>()
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
        data: [
          '项目一',
          '项目二',
          '项目三',
          '项目四',
          '项目五',
          '项目六',
          '项目七',
          '项目八',
          '项目九',
          '项目十'
        ]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130, 140, 200, 360],
          type: 'bar',
          name: '项目占比'
        },
        {
          data: [120, 200, 150, 80, 70, 110, 130, 140, 200, 360],
          type: 'bar',
          name: '消费情况'
        }
      ]
    }
    // 生命周期
    onMounted(() => {
      // 定义实例
      var myChart = echarts.init(chartRef.value)
      myChart.setOption(option)
    })

    return () => {
      return (
        <div class="flex">
          <div class={`w-[100%] text-[#080808] text-[16px] ${styles.body}`}>
            <div class={styles.chartTitle}>各类项目消费情况</div>
            <Segmented
              options={[
                { label: '全部', value: '' },
                { label: '会员', value: '1' },
                { label: '非会员', value: '2' }
              ]}
              value={type.value}
              onChange={(v) => (type.value = v as string)}
              class="mb-[20px]"
            />
            <div class="w-[100%] h-[509px]" ref={chartRef} />
          </div>
        </div>
      )
    }
  }
})
