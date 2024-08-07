<template>
  <TableRender :schema="schema" :request="goodsListRequest" ref="tableRef">
    <template #formButton
      ><a-button
        type="primary"
        :onClick="goAdd"
        class="ml-[10px]"
        v-if="editProject"
        >新增菜品</a-button
      ></template
    >
    <template #bodyCell="{ data }">
      <div
        v-if="data?.column?.dataIndex === 'options'"
        class="flex justify-center items-center"
      >
        <a
          type="link"
          class="table-btn"
          v-if="editProject"
          @click="
            () => {
              $router.push(`/project/edit/${data?.record?.id}`)
            }
          "
          >编辑</a
        >
        <a-popconfirm
          title="是否确认删除"
          v-if="editProject"
          :onConfirm="
            () => {
              common
                .deleteProject({
                  serviceProjectId: data.record.id,
                  serviceName: data.record.serviceName
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
          ><a type="link" class="table-btn-danger last" @click="() => {}"
            >删除</a
          ></a-popconfirm
        >
      </div>
      <template v-else-if="data.customer">{{ data.customer }}</template>
      <template v-else>{{ data.text }}</template>
    </template></TableRender
  >
</template>

<script lang="ts" setup>
import { TableRender } from 'store-operations-ui'
import { schema } from './config'
import { useRouter } from 'vue-router'
import { CommonService } from 'store-request'
import { message } from 'ant-design-vue'
import { ref, toRaw } from 'vue'
import { goodsListRequest } from '@/service/goods'

const { editProject } = { editProject: true }

const tableRef = ref()

const common = new CommonService()

const router = useRouter()
const goAdd = () => {
  router.push('/project/add')
}
</script>
