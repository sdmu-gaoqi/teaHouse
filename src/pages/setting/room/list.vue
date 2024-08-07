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
              deleteRoomREquest(data?.record?.id).then(() => {
                message.success('删除成功')
                tableRef.reset?.()
              })
            }
          "
        >
          <a type="link" class="table-btn-danger last">删除</a>
        </a-popconfirm>
      </div>
      <template v-else-if="data?.column?.dataIndex === 'status'">
        <a-switch
          @change="
            async () => {
              const status = data?.record?.status ? 0 : 1
              await updateRoomREquest({
                ...data?.record,
                status
              })
              data.record.status = status
            }
          "
          :checked="data?.record?.status == 1"
        ></a-switch>
      </template>
      <template v-else>{{ data.customer }}</template>
    </template>
  </TableRender>
</template>

<script lang="ts" setup>
import { TableRender } from 'store-operations-ui'
import { schema } from './config'
import { useRouter } from 'vue-router'
import { Room } from 'store-request'
import { computed, ref, toRaw } from 'vue'
import { message } from 'ant-design-vue'
import { useAccess } from '@/hooks'
import {
  deleteRoomREquest,
  roomListRequest,
  updateRoomREquest
} from '@/service/room'
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
  return returnSchema
})

const edit = (data: any) => {
  router.push(`/room/edit/${data.id}`)
}

const tableRef = ref()

const room = new Room()

const router = useRouter()
const goAdd = () => {
  router.push('/room/add')
}
</script>
