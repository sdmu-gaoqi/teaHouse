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

    const route = useRoute()
    const isDetail = route?.path.includes('/marketing/detail')

    const router = useRouter()

    const open = ref(false)

    const formState = ref<Record<'name' | 'discountTime', any>>({
      name: isSame ? marketingData?.name : undefined,
      discountTime:
        isSame && !isEmpty(marketingData?.discountTime)
          ? [
              marketingData?.discountTime?.split('~')[0],
              marketingData?.discountTime?.split('~')[1]
            ]
          : undefined
    })
    const form = ref()
    const selectList = ref(
      marketingData?.projectList?.map((item: any) => ({
        ...item,
        id: item?.projectId,
        serviceName: item?.projectName
      })) || []
    )
    const listValue = ref<SelectListItem[]>(
      isSame ? marketingData?.projectList || [] : []
    )

    let columns = [
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

    if (isDetail) {
      columns.pop()
    }

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
              options={Array.from({ length: 11 }).map((item, index) => {
                const value = 11 + index + ':00'
                return { label: value, value }
              })}
              value={record.discountTime}
              onChange={(v: any) => {
                record.discountTime = v
              }}
              style={{ width: '100px' }}
              bordered={!isDetail}
              disabled={isDetail}
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
              disabled={isDetail}
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
            disabled={isDetail}
            bordered={!isDetail}
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
                  readonly={isDetail}
                  bordered={!isDetail}
                ></Input>
              </Form.Item>
              <Form.Item label="活动时间" name="discountTime">
                {isDetail ? (
                  <div>
                    {formState?.value.discountTime?.[0]} ~{' '}
                    {formState?.value.discountTime?.[1]}
                  </div>
                ) : (
                  <DatePicker.RangePicker
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                    value={formState.value.discountTime}
                    onUpdate:value={(v) => (formState.value.discountTime = v)}
                  ></DatePicker.RangePicker>
                )}
              </Form.Item>
            </Form>
            <FormGroup title="活动优惠" />
            {!isDetail && (
              <Form.Item label="参与活动项目" required labelCol={{ span: 6 }}>
                <Button
                  type="link"
                  class="text-primary pl-0"
                  onClick={() => {
                    open.value = true
                    selectList.value =
                      marketingData?.projectList?.map((item: any) => ({
                        ...item,
                        id: item?.projectId,
                        serviceName: item?.projectName
                      })) || []
                  }}
                >
                  选择项目
                </Button>
              </Form.Item>
            )}
            <Table
              columns={columns}
              dataSource={listValue.value}
              v-slots={tableSlots}
              style={{ marginTop: isDetail ? '10px' : 0 }}
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
        console.log(id, 'id')
        if (id) {
          value.id = id
        }
        value.name = res.name
        value.discountTime =
          dayjs(res.discountTime[0]).format('YYYY-MM-DD 00:00:00') +
          '~' +
          dayjs(res.discountTime[1]).format('YYYY-MM-DD 23:59:59')
        value.projectList = toRaw(listValue.value)
        if (id) {
          value.status = marketingData?.status
          value.isUpdates = marketingData.isUpdates
          await common.updateMs(value)
        } else {
          value.status = 0
          value.isUpdates = 0
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
            modalProps={{
              okText: '确定',
              cancelText: '返回',
              onOk: () => {
                if (isEmpty(selectList.value)) {
                  return message.error('请选择项目')
                }
                listValue.value = [...listValue.value, ...selectList.value]
                open.value = false
              },
              onCancel: () => {
                selectList.value = []
                open.value = false
              }
            }}
            changeState={(data: any) => {
              if (marketingData) {
                marketingData.projectList = data
              }
              selectList.value = data?.map((item: any) => {
                const newItem = {
                  seckillId: id || '',
                  projectId: item.id,
                  projectName: item.serviceName,
                  price: item.price,
                  discountPrice: item?.discountPrice || 1,
                  discountTime: item?.discountTime || '11:00',
                  discountTimeBeforeAfter: item?.discountPrice || 0
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
