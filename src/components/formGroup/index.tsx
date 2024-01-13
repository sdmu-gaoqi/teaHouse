import { defineComponent } from 'vue'
import classify from '@/assets/classify.svg'

const FormGroup = defineComponent({
  props: {
    title: String
  },
  setup(props) {
    return () => {
      return (
        <div class="flex items-center text-[16px]">
          <img class="w-[16px] mr-[10px]" src={classify}></img>
          {props.title}
        </div>
      )
    }
  }
})

export default FormGroup
