import { MemberType, payTypes } from '@/types'
import { FormRender, FormRenderProps, Schema } from 'store-operations-ui'
import { defineComponent, onMounted, ref } from 'vue'
import { editSchema } from '@/pages/setting/project/config'
import { useStore } from 'vuex'
import ProjectType from '@/components/ProjectType/projectType'
import common from '@/servers/common'
import selectProject from './selectProject'
import { ossOrigin } from '@/constant'

export default defineComponent({
  props: {
    onFinish: Function,
    onCancel: Function,
    formState: Object
  },
  // @ts-ignore
  setup: (
    props: FormRenderProps & { formState: Record<string, any>; onFinish?: any }
  ) => {
    const formRef = ref()
    const store = useStore()
    const defaultType = ref<number[]>()
    const typeRef = ref()
    onMounted(async () => {
      const detail = (await common.projectDetail(props.formState.id)) as any
      defaultType.value = [detail.data.categoryId]
      const schema = editSchema
      // @ts-ignore
      schema.properties.store.defaultValue =
        store?.state?.userInfo?.userInfo?.currentStoreName
      if (formRef.value.changeState) {
        formRef.value.changeState({
          ...props?.formState,
          beforeDepositBalance:
            props.formState?.availableBalance -
            props.formState?.totalSpendBalance,
          payMethod: 1,
          remark: detail?.data?.remark,
          pzRoyalty: detail.data.pzRoyalty,
          pzRoyaltyOl: detail.data.pzRoyaltyOl,
          dzRoyalty: detail.data.dzRoyalty,
          dzRoyaltyOl: detail.data.dzRoyaltyOl,
          ztRoyalty: detail.data.ztRoyalty,
          ztRoyaltyOl: detail.data.ztRoyaltyOl,
          ...(detail.data?.coverFileUrl && {
            image: [
              {
                response: {
                  data: {
                    fileId:
                      detail.data?.coverFileUrl?.split('/file/download/')[1]
                  }
                },
                url: `${ossOrigin}${detail.data?.coverFileUrl}`
              }
            ]
          })
        })
      }
    })

    const handleSolts = {
      left: () => {
        return (
          <ProjectType
            className="w-[250px]"
            defaultSelect={defaultType.value}
            key={defaultType.value as any}
            ref={typeRef}
            edit={true}
          ></ProjectType>
        )
      }
    }

    return () => {
      return (
        <FormRender
          schema={editSchema}
          finishBefore="确认提交此菜品信息吗"
          onFinish={(v: any) =>
            props.onFinish({
              ...(v || {}),
              categoryId: typeRef?.value?.selectedKeys?.[0]
            })
          }
          onCancel={props.onCancel}
          ref={formRef}
          onFieldsChanged={(v) => {
            formRef.value.changeState({
              money4:
                (v.beforeDepositBalance || 0) +
                (v.rechargeBalance || 0) +
                (v.giveBalance || 0)
            })
          }}
          v-slots={handleSolts}
          rowClassName="flex-1 pl-[50px] border-l-4 border-indigo-500"
        />
      )
    }
  }
})
