/**
 * @file 选择项目
 * */
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
    formState: Object,
    changeState: Function
  },
  // @ts-ignore
  setup: (
    props: FormRenderProps & {
      formState: Record<string, any>
      onFinish?: any
      changeState: any
    }
  ) => {
    const selectKey = ref()
    const refSelectedRowKeys = ref(props.formState?.selectList || [])
    const dataList = ref([])
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
          const oldValue = refSelectedRowKeys.value?.reduce(
            (result: any, item: any) => {
              const inThisPage = dataList?.value?.some(
                (i: any) => item.id === i?.id
              )
              const select = selectedRows?.some((i: any) => i.id === item.id)
              if (inThisPage && !select) {
                return result
              }
              return [...result, item]
            },
            []
          )
          let list = [
            ...oldValue,
            ...(toRaw(selectedRows) as any)?.map((item: any) => ({
              ...item,
              projectName: item.serviceName,
              projectId: item.id
            }))
          ]
          list = list?.reduce((result, item) => {
            if (result.some((i: any) => i.projectId === item.projectId)) {
              return result
            }
            return [...result, item]
          }, [])
          refSelectedRowKeys.value = list
          if (props.changeState) {
            props.changeState(list)
          }
        },
        onSelect: (record: any, selected: boolean, selectedRows: any[]) => {},
        onSelectAll: (
          selected: boolean,
          selectedRows: any[],
          changeRows: any[]
        ) => {},
        selectedRowKeys: refSelectedRowKeys.value?.map((item: any) => item.id)
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
              scroll: { y: '50vh' },
              rowSelection: rowSelection.value,
              rowKey: 'id',
              pagination: false,
              size: 'small'
            }}
            key={selectKey.value}
            request={(params: any) => {
              return common
                .projectList({
                  ...params,
                  pageSize: 100,
                  categoryId: selectKey.value
                })
                .then((res: any) => {
                  dataList.value = res?.rows as any
                  return res
                })
            }}
            cardStyle={{ flex: 1 }}
          />
        </div>
      )
    }
  }
})
