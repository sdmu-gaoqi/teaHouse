import { defineComponent, ref } from 'vue'
import styles from './style.module.scss'
import { Button, DatePicker } from 'ant-design-vue'
import dayjs from 'dayjs'
import { ReloadOutlined } from '@ant-design/icons-vue'

export const CardProps = {
  title: String,
  tabs: Array,
  showDate: Boolean,
  class: String,
  contentClass: String,
  now: Boolean,
  time: Number,
  request: Function
} as const

const dateMenus = [
  { label: '今日', value: 'date' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '全年', value: 'year' },
  { label: '全部', value: 'all' }
]

const Card = defineComponent({
  props: CardProps,
  setup: (props, { slots }) => {
    const { showDate, now } = props
    const activeKey = ref('date')

    const changeTab = (key: string) => {
      activeKey.value = key
    }

    return () => (
      <div class={`${props.class} ${styles.card} mb-[10px]`}>
        <div class={styles.header}>
          <div class={styles.title}>
            {props.title}
            {now && (
              <span class="text-red-500 text-[12px] ml-[10px] font-normal">
                数据更新到：
                {dayjs(props.time || new Date()).format('YYYY/MM/DD HH:mm:ss')}
                <ReloadOutlined
                  class="cursor-pointer ml-[10px] text-primary"
                  onClick={() => {
                    if (props?.request) {
                      props?.request()
                    }
                  }}
                />
              </span>
            )}
          </div>
        </div>
        <div class={`${props.contentClass} p-[15px]`}>{slots.default?.()}</div>
      </div>
    )
  }
})

export default Card
