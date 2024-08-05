<template>
  <TableRender
    :schema="listSchema"
    :request="roomListRequest"
    :table-props="{ scroll: { x: 2000 } }"
    ref="tableRef"
  >
    <template #formButton>
      <Button type="primary" :onClick="goAdd" class="ml-[10px]"
        >新增包厢</Button
      ></template
    >
    <template #bodyCell="{ data }">
      <div
        v-if="data?.column?.dataIndex === 'options'"
        class="flex justify-center items-center"
      >
        <a type="link" class="table-btn" @click="() => edit(data.record)"
          >编辑</a
        >
        <a-popconfirm
          title="是否确认删除"
          :onConfirm="
            () => {
              room
                .delete({
                  roomId: data.record.roomId,
                  roomNo: data.record.roomNo
                })
                .then(() => {
                  message.success('删除成功')
                  const params = {
                    ...(toRaw(tableRef.params?.[0]) || {}),
                    pageNum: 1
                  }
                  tableRef.run(params)
                })
            }
          "
        >
          <a type="link" class="table-btn-danger last">删除</a>
        </a-popconfirm>
      </div>
      <template v-else-if="data?.column?.dataIndex === 'status'">
        <a-switch></a-switch>
      </template>
      <template v-else>{{ data.customer }}</template>
    </template>
  </TableRender>
  <BusinessModal
    :open="open"
    :type="BusinessModalType.编辑包厢"
    :onCancel="() => (open = false)"
    :onFinish="onFinish"
    :formState="formState"
  ></BusinessModal>
</template>

<script lang="ts" setup>
import { TableRender } from 'store-operations-ui'
import { schema } from './config'
import { useRouter } from 'vue-router'
import { Button, message } from 'ant-design-vue'
import { Room } from 'store-request'
import { computed, ref, toRaw } from 'vue'
import BusinessModal from '@/components/businessModal/businessModal'
import { BusinessModalType } from '@/components/businessModal/businessModal.type'
import { sleep } from 'wa-utils'
import { useAccess } from '@/hooks'
import { roomListRequest } from '@/service/room'
import useDict from '@/hooks/useDict'
import { Dict } from '@/service/typing'

const { dictLists } = useDict(Dict.包厢类型)

const listSchema = computed(() => {
  const categoryField = schema.tabs[0].columns.find(
    (i) => i.dataIndex === 'category'
  )
  if (categoryField) {
    categoryField.options = toRaw(dictLists.value)
  }

  const returnSchema = {
    ...schema,
    options: {
      category: toRaw(dictLists.value)
    }
  }
  console.log(returnSchema, 'returnSchema')
  return returnSchema
})

const { editRoom } = useAccess()

const open = ref(false)
const formState = ref<any>({})

const edit = (data: any) => {
  open.value = true
  formState.value = data
}

const tableRef = ref()

const room = new Room()

const router = useRouter()
const goAdd = () => {
  router.push('/room/add')
}
const onFinish = async (v: any) => {
  await room.update({
    ...v
  })
  message.success('更新成功')
  open.value = false
  await sleep(300)
  tableRef.value.run(tableRef.value.params?.[0])
}
</script>
