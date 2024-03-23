<template>
  <TableRender
    :schema="schema"
    :request="store.loginList"
    :tableProps="{ scroll: { x: 1600 } }"
  >
    <template #bodyCell="{ data }">
      <div
        v-if="data?.column?.dataIndex === 'options'"
        class="flex justify-center items-center"
      >
        <a
          type="link"
          class="table-btn"
          @click="() => edit(data.record, 'edit')"
          >编辑</a
        >
        <a
          type="link"
          class="table-btn last"
          @click="() => edit(data.record, 'view')"
          >查看</a
        >
      </div>
      <template v-else>{{ data.text }}</template>
    </template>
  </TableRender>
  <BusinessModal
    :type="BusinessModalType.门店详情"
    :open="open"
    :formState="formState"
    :onFinish="onFinish"
    :onCancel="() => (open = false)"
    :modalProps="{
      title: formState?.id ? '编辑门店' : '门店详情'
    }"
  />
</template>

<script lang="ts" setup>
import { TableRender } from 'store-operations-ui'
import { schema } from './config'
import { Store } from 'store-request'
import BusinessModal from '@/components/businessModal/businessModal'
import { BusinessModalType } from '@/components/businessModal/businessModal.type'
import { ref } from 'vue'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'
import { ossOrigin } from '@/constant'

const open = ref(false)
const formState = ref<any>({})
const type = ref<'view' | 'edit'>('view')

const edit = (data: any, t: 'view' | 'edit') => {
  open.value = true
  formState.value = { ...data, modalType: t }
  type.value = t
}

const onFinish = async (v: any) => {
  const value = {
    address: v?.address,
    banner: v?.image?.map(
      (item: any) =>
        item?.response?.data?.filePath?.split('/file/download/')[1] ||
        item?.url?.split('/file/download/')[1]
    ),
    businessHours: v?.businessHours
      ?.map((item: string) => dayjs(item).format('HH:mm'))
      ?.join('-'),
    code: formState?.value?.code,
    id: formState?.value?.id,
    name: v?.name,
    phone: v?.phone,
    remark: v?.remark,
    tel: v?.tel
  }
  await store.update(value)
  message.success('更新成功')
  formState.value = {}
  open.value = false
}

const store = new Store()
</script>
