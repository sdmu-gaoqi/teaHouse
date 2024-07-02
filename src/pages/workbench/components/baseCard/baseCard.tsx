import { defineComponent, onMounted, ref } from 'vue'
import styles from './style.module.scss'
import { formatMoney } from '@/utils'

const BaseCardProps = {
  title: String,
  allMoney: String,
  id: String,
  bg: String,
  icon: String,
  value: Number,
  isCount: Boolean
}

export default defineComponent({
  name: 'Echarts',
  props: BaseCardProps,
  setup(props) {
    return () => {
      const { id } = props
      return (
        <div id={id} class={`${styles.card}`} style={{ background: props.bg }}>
          <div class={styles.title}>{props.title}</div>
          <div class={styles.money}>
            {props?.value
              ? props?.isCount
                ? props?.value
                : formatMoney(props?.value)
              : '--'}
          </div>
          <img src={props.icon} class={styles.icon} />
        </div>
      )
    }
  }
})
