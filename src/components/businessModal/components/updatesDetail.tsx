import News from '@/components/news'
import { ossOrigin } from '@/constant'
import { Image, Spin } from 'ant-design-vue'
import { Store } from 'store-request'
import { defineComponent, onMounted, toRaw } from 'vue'
import { useRequest } from 'vue-hooks-plus'

export default defineComponent({
  props: ['formState'],
  setup(props, ctx) {
    const store = new Store()
    const { run, loading, data } = useRequest(store.storedYnamiDetail, {
      manual: true
    })

    onMounted(() => {
      if (props.formState.id) {
        run({
          id: props.formState.id
        })
      }
    })

    return () => {
      const detail = (data.value as any)?.data as any
      return (
        <Spin spinning={loading.value}>
          <div class="pt-[20px]">
            <div class="flex">
              <div class="text-gray-500 w-[100px] h-[50px] text-right pr-[20px]">
                动态标题
              </div>
              <div class="">{detail?.title}</div>
            </div>
            <div class="flex">
              <div class="text-gray-500 w-[100px] h-[100px] text-right pr-[20px]">
                <div class="text-gray-500 w-[100px] h-[50px] text-right pr-[20px]">
                  封面图片
                </div>
              </div>
              <Image src={`${ossOrigin}${detail?.coverFileUrl}`} width={100} />
            </div>
            <div class="flex">
              <div class="text-gray-500 w-[100px] h-[50px] text-right pr-[20px]"></div>
              <News content={detail?.content} />
            </div>
          </div>
        </Spin>
      )
    }
  }
})
