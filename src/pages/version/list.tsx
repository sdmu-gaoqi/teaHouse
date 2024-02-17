import { List } from 'ant-design-vue'
import { defineComponent, ref, render } from 'vue'

const Version = defineComponent({
  setup() {
    const list = ref([
      {
        version: 'V1.0.0',
        date: '2023.11.26',
        content: `
1. 会员管理
2. 订单管理
3. 价目表设置
4. 房间管理`
      },

      {
        version: 'V1.2.0',
        date: '2024.02.17',
        content: `
1.系统管理-价目表信息：
  (1)新增价目表分类；
  (2)支持线上项目提成和项目自推提成设置；
2.营销管理：
新增限时秒杀活动功能；
3.优化了角色管理-权限设置功能；
4.会员管理：新增充值记录、消费记录、退卡功能；
5.订单管理：
  (1)创建订单时，可根据价目表分类查询项目，
  (2)参与营销活动的项目，显示"活动"标记；
  (3)非会员订单结算时，支持营销活动结算；
  (4)支持美团订单结算；
  (5)优化订单列表显示；`
      }
    ])
    return () => (
      <div class="bg-[#fff] px-[50px] py-[20px]">
        <List dataSource={list.value}>
          {list.value.map((item) => (
            <List.Item>
              <pre style={{ margin: 0 }}>
                <div class="text-[20px] font-bold">{item.version}</div>
                <div class="text-[16px]">发布日期:{item.date}</div>
                <pre style={{ margin: 0 }}>{item.content}</pre>
              </pre>
            </List.Item>
          ))}
        </List>
      </div>
    )
  }
})

export default Version
