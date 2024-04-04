import { defineComponent, onMounted, ref } from 'vue'
import styles from './style.module.scss'

const BaseCardProps = {
  title: String,
  allMoney: String,
  id: String,
  bg: String,
  icon: String
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
          <div class={styles.money}>--</div>
          <div class={styles.sub}>对比昨日 --%</div>
          <div class={styles.sub}>总营业额 ¥--</div>
          <img src={props.icon} class={styles.icon} />
        </div>
      )
    }
  }
})
