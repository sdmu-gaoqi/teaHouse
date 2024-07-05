import { defineComponent } from 'vue'
import En from '@/assets/en.webp'
import styles from './style.module.scss'

const EngineerCard = defineComponent({
  props: {
    nickName: String,
    remark: String
  },
  setup(props) {
    return () => (
      <div
        class={`w-[100px] flex-shrink-0 relative select-none ml-[15px]  pb-[10px] ${styles.enItem} hover:shadow-lg`}
        style={{ borderWidth: '1px' }}
      >
        <span
          class={`absolute top-[6px] right-[6px] scale-[80%] text-[#fff] bg-lime-500 px-[14px] py-[4px] text-[12px]`}
        >
          空闲
        </span>
        <div class="w-[100%] h-[100px] bg-purple-50"></div>
        <div class="px-[5px] py-[5px]">{props.nickName}</div>
        <div class="pr-[5px] text-gray-400 text-[12px] mt-[8px] relative scale-90">
          <div class="text-primary scale-[90%] block absolute top-0 right-[2px] scale-60">
            上钟--次
          </div>
        </div>
      </div>
    )
  }
})

export default EngineerCard
