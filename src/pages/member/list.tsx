import { TableRender } from 'store-operations-ui'
import { defineComponent } from 'vue'
import { schema } from './config'
import { memberListRequest } from '@/service/member'
import { Button, Space } from 'ant-design-vue'
import { useRouter } from 'vue-router'

export default defineComponent(() => {
  const router = useRouter()
  const handleSlots = {
    formButton: () => {
      return (
        <Button
          type="primary"
          class="ml-[10px]"
          onClick={() => router.push('/member/add')}
        >
          新增会员
        </Button>
      )
    },
    bodyCell: ({ data }: any) => {
      const { column, record } = data
      if (column?.dataIndex === 'options') {
        return (
          <Space>
            <Button
              onClick={() => {
                router.push(`/member/edit/${record?.code}`)
              }}
            >
              编辑
            </Button>
            {record?.status && <Button>充值</Button>}
            {record?.status && <Button>充值记录</Button>}
            {record?.status && <Button>消费记录</Button>}
            {record?.status && <Button>退卡</Button>}
          </Space>
        )
      }
      return <div>{data.customer}</div>
    }
  }

  return () => {
    return (
      <TableRender
        schema={schema}
        request={memberListRequest}
        v-slots={handleSlots}
      ></TableRender>
    )
  }
})
