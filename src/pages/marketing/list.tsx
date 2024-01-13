import { TableProps, TableRender } from 'store-operations-ui'
import { defineComponent } from 'vue'
import { Button, Modal } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import common from '@/servers/common'

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
          dataIndex: 'discountTime'
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
          dataIndex: 'createTime'
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
        if (data.column.dataIndex === 'options') {
          const isEnd = data.record.status === 2
          return (
            <div class="flex">
              <Button type="link" style={{ paddingLeft: 0 }}>
                {data.record.status === 0 ? '上架' : '下架'}
              </Button>
              {!isEnd && (
                <Button
                  style={{ paddingLeft: 0 }}
                  type="link"
                  onClick={() =>
                    router.push(`/marketing/edit/${data.record.id}`)
                  }
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
                style={{ paddingLeft: 0 }}
                type="link"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: '提示',
                    content: '是否确认删除',
                    okText: '确定',
                    cancelText: '取消'
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
        ></TableRender>
      )
    }
  }
})

export default Marketing
