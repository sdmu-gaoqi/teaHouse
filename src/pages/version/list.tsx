import { getVersionLogs } from '@/servers/set'
import { List } from 'ant-design-vue'
import { defineComponent, onMounted, ref } from 'vue'
import './list.scss'

const Version = defineComponent({
  setup() {
    const content = ref()
    onMounted(() => {
      getVersionLogs().then((res) => {
        content.value = res?.data?.content
      })
    })
    const list = ref([
      {
        version: 'V1.3.0',
        date: '2024.02.17',
        content: `
1.系统管理-菜品信息：
  (1)新增菜品分类；
  (2)支持线上项目提成和项目自推提成设置；
2.营销管理：
新增限时秒杀活动功能；
3.优化了角色管理-权限设置功能；
4.会员管理：新增消费记录、退卡功能；
5.订单管理：
  (1)创建订单时，可根据菜品分类查询项目，
  (2)参与营销活动的项目，显示"活动"标记；
  (3)非会员订单结算时，支持营销活动结算；
  (4)支持美团订单结算；
  (5)优化订单列表显示；`
      },
      {
        version: 'V1.1.0',
        date: '2023.12.30',
        content: `
1.系统管理-菜品信息：
  (1)新增菜品分类；
  (2)支持线上项目提成和项目自推提成设置；
2.营销管理：
新增限时秒杀活动功能；
3.优化了角色管理-权限设置功能；
4.会员管理：新增消费记录、退卡功能；
5.订单管理：
  (1)创建订单时，可根据菜品分类查询项目，
  (2)参与营销活动的项目，显示"活动"标记；
  (3)非会员订单结算时，支持营销活动结算；
  (4)支持美团订单结算；
  (5)优化订单列表显示；`
      },
      {
        version: 'V1.0.0',
        date: '2023.11.26',
        content: `
1.系统登录：支持用户名+密码登录；
2.订单管理：
  (1)创建订单时，可对订单进行修改、删除、结算；
  (2)支持非会员、会员订单结算，会员支持折扣卡结算；
  (3)支持非会员、会员订单列表显示；
3.会员管理：
  (1)支持新增折扣卡会员信息；
  (2)支持会员充值功能；
  (3)可查看充值记录；
4.系统管理-包厢管理：
创建门店包厢信息，动态显示在创建订单页面；
5.系统管理-菜品设置：创建门店菜品信息；`
      }
    ])
    return () => (
      <div class="bg-[#fff] px-[50px] py-[20px] version-page">
        <List dataSource={list.value}>
          <div innerHTML={content.value}></div>
        </List>
      </div>
    )
  }
})

export default Version
