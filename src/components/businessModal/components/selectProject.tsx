import { MemberType, payTypes } from '@/types'
import { formatMoney } from '@/utils'
import { FormRenderProps, TableProps, TableRender } from 'store-operations-ui'
import { defineComponent, onMounted, ref } from 'vue'
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
              key: 'name'
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
                dataIndex: 'name',
                width: 100
              },
              {
                title: '项目价格 / 元',
                dataIndex: 'money'
              },
              {
                title: '时长 / 分钟',
                dataIndex: 'time'
              }
            ]
          }
        ],
        options: {
          roleId: []
        }
      }
      return (
        <div class="flex">
          <ProjectType className="w-[200px]" edit={false} />
          <TableRender
            schema={schema}
            tableProps={{ scroll: 1200 }}
            request={common.msProjectList}
            cardStyle={{ flex: 1 }}
          />
        </div>
      )
    }
  }
})
