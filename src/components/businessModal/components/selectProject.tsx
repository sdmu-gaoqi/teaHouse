import { MemberType, payTypes } from '@/types'
import { formatMoney } from '@/utils'
import { FormRenderProps, TableProps, TableRender } from 'store-operations-ui'
import { defineComponent, onMounted, ref, toRaw } from 'vue'
import common from '@/servers/common'
import ProjectType from '@/components/ProjectType/projectType'

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
    const selectKey = ref()
    const refSelectedRowKeys = ref([])
    return () => {
      const schema: TableProps['schema'] = {
        title: '选择项目',
        form: {
          search: true,
          export: false,
          reset: false,
          fields: [
            {
              type: 'search',
              label: '项目名称',
              placeholder: '请输入项目名称',
              key: 'serviceName'
            }
          ]
        },
        tabs: [
          {
            title: '会员订单',
            key: 'one',
            columns: [
              {
                fixed: true,
                title: '项目名称',
                dataIndex: 'serviceName',
                width: 300
              },
              {
                title: '项目价格 / 元',
                dataIndex: 'price',
                format: 'money'
              },
              {
                title: '时长 / 分钟',
                dataIndex: 'duration'
              }
            ]
          }
        ],
        options: {
          roleId: []
        }
      }
      const rowSelection = ref({
        checkStrictly: false,
        onChange: (
          selectedRowKeys: (string | number)[],
          selectedRows: any[]
        ) => {
          refSelectedRowKeys.value = toRaw(selectedRowKeys) as any
        },
        onSelect: (record: any, selected: boolean, selectedRows: any[]) => {},
        onSelectAll: (
          selected: boolean,
          selectedRows: any[],
          changeRows: any[]
        ) => {},
        selectedRowKeys: refSelectedRowKeys.value
      })
      return (
        <div class="flex">
          <ProjectType
            className="w-[200px]"
            edit={false}
            canSelectMain={true}
            onChange={(v: any) => {
              selectKey.value = v?.[0] || ''
            }}
          />
          <TableRender
            schema={schema}
            tableProps={{
              scroll: 1200,
              rowSelection: rowSelection.value,
              rowKey: 'id'
            }}
            key={selectKey.value}
            request={(params: any) => {
              return common.projectList({
                ...params,
                categoryId: selectKey.value
              })
            }}
            cardStyle={{ flex: 1 }}
          />
        </div>
      )
    }
  }
})
