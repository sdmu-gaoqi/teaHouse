import { TableProps, TableRender } from 'store-operations-ui'
import { defineComponent, ref } from 'vue'
import { Button, Modal, message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import common from '@/servers/common'
import { Storage, isEmpty } from 'wa-utils'

export const schema: TableProps['schema'] = {
  title: '限时秒杀活动',
  form: {
    search: true,
    export: false,
    reset: true,
    fields: [
      {
        label: '名称',
        type: 'search',
        placeholder: '秒杀活动名称',
        key: 'name'
      },
      {
        label: '上架状态',
        type: 'select',
        placeholder: '上架状态',
        key: 'isUpdates'
      },
      {
        label: '活动状态',
        type: 'select',
        placeholder: '活动状态',
        key: 'status'
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
          title: '秒杀活动名称',
          dataIndex: 'name'
        },
        {
          title: '活动时间',
          dataIndex: 'discountTime',
          width: 300
        },
        {
          title: '活动项目数',
          dataIndex: 'projectList'
        },
        {
          title: '上架状态',
          dataIndex: 'isUpdates',
          options: [
            { label: '待上架', value: 0 },
            { label: '已上架', value: 1 },
            { label: '已下架', value: 2 }
          ]
        },
        {
          title: '活动状态',
          dataIndex: 'status',
          options: [
            { label: '未开始', value: 0 },
            { label: '进行中', value: 1 },
            { label: '已结束', value: 2 }
          ]
        },
        {
          title: '创建日期',
          dataIndex: 'createTime',
          width: 200
        },
        {
          title: '操作',
          dataIndex: 'options',
          fixed: 'right',
          width: 250
        }
      ]
    }
  ],
  options: {
    isUpdates: [
      { label: '待上架', value: 0 },
      { label: '已上架', value: 1 },
      { label: '已下架', value: 2 }
    ],
    status: [
      { label: '未开始', value: 0 },
      { label: '进行中', value: 1 },
      { label: '已结束', value: 2 }
    ]
  }
}

const Marketing = defineComponent({
  setup(props) {
    const router = useRouter()
    const tableRef = ref()
    const session = new Storage('session')
    const handleSlots = {
      formButton: () => {
        return (
          <Button
            type="primary"
            class="ml-[10px]"
            onClick={() => router.push('/marketing/add')}
          >
            新建秒杀
          </Button>
        )
      },
      bodyCell: ({ data }: any) => {
        if (data.column.dataIndex === 'projectList') {
          return data.record.projectList?.length || 0
        }
        if (data.column.dataIndex === 'discountTime') {
          const discountTime = data?.record?.discountTime
          if (!isEmpty(discountTime)) {
            return (
              <>
                开始时间：{discountTime?.split('~')[0]}
                <br />
                结束时间：{discountTime?.split('~')[1]}
              </>
            )
            return ''
          }
          return discountTime
        }
        if (data.column.dataIndex === 'options') {
          const isEnd = data.record.status === 2
          return (
            <div class="flex justify-center">
              <Button
                type="link"
                style={{ paddingLeft: 0 }}
                onClick={async () => {
                  const isUpdates = +data.record.isUpdates === 1 ? 2 : 1
                  await common.updateMs({
                    ...data.record,
                    projectList: data?.record?.projectList || [],
                    isUpdates
                  })
                  message.success('保存成功')
                  data.record.isUpdates = isUpdates
                  tableRef.value.run(tableRef.value.params?.[0])
                }}
              >
                {+data.record.isUpdates === 1 ? '下架' : '上架'}
              </Button>
              {!isEnd && (
                <Button
                  style={{ paddingLeft: 0 }}
                  type="link"
                  onClick={() => {
                    router.push(`/marketing/edit/${data.record.id}`)
                    session.baseSet('marketingData', data.record)
                  }}
                >
                  编辑
                </Button>
              )}
              {isEnd && (
                <Button style={{ paddingLeft: 0 }} type="link">
                  详情
                </Button>
              )}
              <Button
                style={{ paddingLeft: 0, paddingRight: 0 }}
                type="link"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: '提示',
                    content: '是否确认删除',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: async () => {
                      await common.deleteMs({
                        ids: data.record.id + ''
                      })
                      message.success('删除成功')
                      tableRef.value.run(tableRef.value.params?.[0])
                    }
                  })
                }}
              >
                删除
              </Button>
            </div>
          )
        }
        return <div>{data.customer}</div>
      }
    }
    return () => {
      return (
        <TableRender
          schema={schema}
          tableProps={{ scroll: { x: 1200 } }}
          v-slots={handleSlots}
          request={common.msList}
          ref={tableRef}
        ></TableRender>
      )
    }
  }
})

export default Marketing
