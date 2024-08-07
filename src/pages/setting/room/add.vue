<template>
  <FormCard :title="title">
    <template #content>
      <FormRender
        ref="formRef"
        :on-finish="onFinish"
        :on-cancel="onCancel"
        :schema="schema"
        finishBefore="确认提交包厢信息吗"
        v-if="dictLists?.length > 0"
      ></FormRender>
    </template>
  </FormCard>
</template>

<script lang="ts" setup>
import { FormRender, FormCard } from 'store-operations-ui'
import { editSchema } from './config'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep, debounce, sleep } from 'wa-utils'
import { message } from 'ant-design-vue'
import useDict from '@/hooks/useDict'
import { Dict, ParamsAddRoom, RoomItem } from '@/service/typing'
import { computed, onMounted, ref, toRaw } from 'vue'
import {
  addRoomREquest,
  roomDetailRequest,
  updateRoomREquest
} from '@/service/room'
import updatesDetail from '@/components/businessModal/components/updatesDetail'

const route = useRoute()
const id = route?.params?.id

const { dictLists } = useDict(Dict.包厢类型)

const title = id ? '编辑包厢' : '新增包厢'

const schema = computed(() => {
  const cloneSchema = cloneDeep(editSchema)
  cloneSchema.properties.category.props.options = dictLists.value
  return cloneSchema
})

const router = useRouter()

const formRef = ref()

const onFinish = async (value: ParamsAddRoom) => {
  if (id) {
    await updateRoomREquest({
      ...value,
      id: Number(id)
    })
  } else {
    await addRoomREquest({
      ...value,
      status: 1
    })
  }
  message.success('保存成功')
  await sleep(300)
  router.back()
}

onMounted(async () => {
  if (id) {
    const res = await roomDetailRequest(Number(id))
    formRef.value.changeState({
      ...res.data,
      lowestPrice: res.data?.lowestPrice ?? 0,
      overtimeUnitPrice: res.data?.overtimeUnitPrice ?? 0
    })
  }
})

const onCancel = debounce(() => {
  router.back()
})
</script>
