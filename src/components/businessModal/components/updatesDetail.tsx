import { defineComponent } from 'vue'

export default defineComponent({
  setup(props, ctx) {
    return () => {
      return (
        <div class="pt-[20px]">
          <div class="flex">
            <div class="text-gray-500 w-[100px] h-[50px] text-right pr-[20px]">
              动态标题
            </div>
            <div class="">春节放假通知</div>
          </div>
          <div class="flex">
            <div class="text-gray-500 w-[100px] h-[100px] text-right pr-[20px]">
              封面图片
            </div>
            <img class=""></img>
          </div>
          <div class="flex">
            <div class="text-gray-500 w-[100px] h-[50px] text-right pr-[20px]">
              内容
            </div>
            <div class="">春节放假通知</div>
          </div>
        </div>
      )
    }
  }
})
