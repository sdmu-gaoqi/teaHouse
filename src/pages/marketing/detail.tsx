import { defineComponent, onUnmounted, ref, toRaw } from 'vue'
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Table,
  TimePicker,
  message
} from 'ant-design-vue'
import FormGroup from '@/components/formGroup'
import { FormCard } from 'store-operations-ui'
import { useRoute, useRouter } from 'vue-router'
import BusinessModal from '@/components/businessModal/businessModal'
import { BusinessModalType } from '@/components/businessModal/businessModal.type'
import dayjs from 'dayjs'
import { Storage, isEmpty } from 'wa-utils'
import common from '@/servers/common'

type SelectListItem = {
  discountTimeBeforeAfter: 0 | 1 // 0前 1后
  discountTime: string
  discountPrice: string
  price: string
  projectName: string
  projectId: number
  seckillId: number
  id: number
}

const MarketingDetail = defineComponent({
  setup(props) {
    const {
      params: { id }
    } = useRoute()
    const isEdit = !!id
    const session = new Storage('session')
    const marketingData = session.baseGet('marketingData')
    const isSame = String(marketingData?.id) === String(id)

    const router = useRouter()

    const open = ref(false)

    const formState = ref<Record<'name' | 'discountTime', any>>({
      name: isSame ? marketingData?.name : undefined,
      discountTime:
        isSame && !isEmpty(marketingData?.discountTime)
          ? [
              dayjs(marketingData?.discountTime?.split('~')[0]),
              dayjs(marketingData?.discountTime?.split('~')[1])
            ]
          : undefined
    })
    const form = ref()
    const selectList = ref([])
    const listValue = ref<SelectListItem[]>(
      isSame ? marketingData?.projectList || [] : []
    )

    const columns = [
      {
        title: '项目名称',
        dataIndex: 'projectName'
      },
      {
        title: '项目原价',
        dataIndex: 'price'
      },
      {
        title: '秒杀时段',
        dataInde: 'discountTime',
        width: 300,
        slots: {
          customRender: 'discountTime'
        }
      },
      {
        title: '活动价/元',
        dataInde: 'money',
        slots: {
          customRender: 'money'
        }
      },
      {
        title: '操作',
        dataInde: 'options',
        slots: {
          customRender: 'options'
        }
      }
    ]

    const tableSlots = {
      options: ({
        index,
        record
      }: {
        index: number
        record: (typeof listValue.value)[0]
      }) => {
        return (
          <Button
            type="link"
            class="p-0"
            danger
            onClick={() => {
              Modal.confirm({
                title: '提示',
                content: '是否确认删除',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                  listValue.value = listValue.value.filter(
                    (item, i) => i !== index
                  )
                }
              })
            }}
          >
            删除
          </Button>
        )
      },
      discountTime: ({
        index,
        record
      }: {
        index: number
        record: (typeof listValue.value)[0]
      }) => {
        return (
          <div>
            <Select
              options={Array.from({ length: 23 }).map((item, index) => {
                const value = (index >= 10 ? index : `0${index}`) + ':00'
                return { label: value, value }
              })}
              value={record.discountTime}
              onChange={(v: any) => {
                record.discountTime = v
              }}
              style={{ width: '100px' }}
            ></Select>
            <Radio.Group
              class="ml-[10px]"
              value={record.discountTimeBeforeAfter}
              onChange={(v) => {
                record.discountTimeBeforeAfter = v.target.value
              }}
              options={[
                { label: '前', value: 0 },
                { label: '后', value: 1 }
              ]}
            />
          </div>
        )
      },
      money: ({
        index,
        record
      }: {
        index: number
        record: (typeof listValue.value)[0]
      }) => {
        return (
          <InputNumber
            class="w-[100px]"
            placeholder="请输入"
            value={record.discountPrice}
            onChange={(v) => {
              record.discountPrice = v as string
            }}
            min={0}
          ></InputNumber>
        )
      }
    }

    const hanldSolts = {
      content: () => {
        return (
          <div class="px-[26px] pt-[20px]">
            <FormGroup title="基础信息" />
            <Form
              class="mt-[20px]"
              labelCol={{ span: 6 }}
              model={formState.value}
              ref={form}
              rules={{
                name: { required: true, message: '请输入名称' },
                discountTime: { required: true, message: '请选择时间' }
              }}
            >
              <Form.Item label="秒杀活动名称" name="name">
                <Input
                  placeholder="请输入"
                  value={formState.value.name}
                  class="max-w-[500px]"
                  onUpdate:value={(v) => (formState.value.name = v)}
                ></Input>
              </Form.Item>
              <Form.Item label="活动时间" name="discountTime">
                <DatePicker.RangePicker
                  showTime
                  value={formState.value.discountTime}
                  onUpdate:value={(v) => (formState.value.discountTime = v)}
                ></DatePicker.RangePicker>
              </Form.Item>
            </Form>
            <FormGroup title="活动优惠" />
            <Form.Item label="参与活动项目" required labelCol={{ span: 6 }}>
              <Button
                type="link"
                class="text-primary pl-0"
                onClick={() => {
                  open.value = true
                }}
              >
                选择项目
              </Button>
            </Form.Item>
            <Table
              columns={columns}
              dataSource={listValue.value}
              v-slots={tableSlots}
            />
          </div>
        )
      }
    }

    const submit = () => {
      if (isEmpty(listValue.value)) {
        return message.warning('请选择参与活动项目')
      }
      let value: any = {}
      for (let i of listValue.value) {
        if (!i.discountTime || !(i.discountTimeBeforeAfter + 1)) {
          message.error(`请完善${i.projectName}的秒杀时段`)
          return
        }
        if (!i.discountPrice) {
          message.error(`请完善${i.projectName}的活动价`)
          return
        }
      }
      form.value.validateFields().then(async (res: any) => {
        if (id) {
          value.id = id
        }
        value.name = res.name
        value.discountTime =
          dayjs(res.discountTime[0]).format('YYYY-MM-DD HH:mm:ss') +
          '~' +
          dayjs(res.discountTime[1]).format('YYYY-MM-DD HH:mm:ss')
        value.projectList = toRaw(listValue.value)
        value.status = 1
        value.isUpdates = 1
        if (id) {
          await common.updateMs(value)
        } else {
          await common.addMs(value)
        }
        message.success('保存成功')
        router.go(-1)
      })
    }

    onUnmounted(() => {
      session.remove('marketingData')
    })

    return () => {
      return (
        <div>
          <FormCard
            title={isEdit ? '编辑秒杀活动' : '新建秒杀活动'}
            footer={{
              cancel: '取消',
              submit: '保存'
            }}
            onCancel={() => {
              router.back()
            }}
            onSubmit={() => {
              submit()
            }}
            v-slots={hanldSolts}
            className="pb-[20px]"
          ></FormCard>
          <BusinessModal
            type={BusinessModalType.选择项目}
            open={open.value}
            onCancel={() => {
              open.value = false
            }}
            formState={{
              selectList: selectList.value
            }}
            modalProps={{
              okText: '确定',
              cancelText: '返回',
              onOk: () => {
                listValue.value = selectList.value
                open.value = false
              },
              onCancel: () => {
                selectList.value = []
                open.value = false
              }
            }}
            changeState={(data: any) => {
              selectList.value = data?.map((item: any) => {
                const newItem = {
                  seckillId: id,
                  projectId: item.id,
                  projectName: item.serviceName,
                  price: item.price,
                  discountPrice: 1,
                  discountTime: '00:00',
                  discountTimeBeforeAfter: 0
                }
                return newItem
              })
            }}
          />
        </div>
      )
    }
  }
})

export default MarketingDetail
