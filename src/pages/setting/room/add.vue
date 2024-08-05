<template>
  <FormCard title="新增包厢">
    <template #content>
      <FormRender
        :on-finish="onFinish"
        :on-cancel="onCancel"
        :schema="editSchema"
        finishBefore="确认提交包厢信息吗"
      ></FormRender>
    </template>
  </FormCard>
</template>

<script lang="ts" setup>
import { FormRender, FormCard } from 'store-operations-ui'
import { editSchema } from './config'
import { useRouter } from 'vue-router'
import { debounce, sleep } from 'wa-utils'
import { Room } from 'store-request'
import { message } from 'ant-design-vue'
import request from '@/service'

const room = new Room()

const router = useRouter()

const onFinish = async (value: Record<string, any>) => {
  request.request({
    url: '/admin-api/admin-api/guest-room/save',
    data: value
  })

  message.success('保存成功')
  await sleep(300)
  router.back()
}
const onCancel = debounce(() => {
  router.back()
})
</script>
