import { defineComponent } from 'vue'
import styles from './index.module.scss'

const News = defineComponent({
  props: ['content'],
  setup(props: { content: any }) {
    console.log(props, 'props')
    return () => {
      return (
        <div class={styles.news}>
          <div class="" innerHTML={props?.content}></div>
        </div>
      )
    }
  }
})

export default News
