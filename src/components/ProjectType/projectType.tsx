import { Modal, Tree, TreeProps } from 'ant-design-vue'
import { defineComponent, ref } from 'vue'
import styles from './index.module.scss'
import {
  PlusSquareTwoTone,
  EditTwoTone,
  CloseSquareTwoTone
} from '@ant-design/icons-vue'
import { FormRender } from 'store-operations-ui'

const addSchema = {
  type: 'object',
  properties: {
    parent: {
      title: '父节点',
      widget: 'select',
      props: {
        placeholder: '请选择'
      }
    },
    name: {
      title: '名称',
      type: 'string',
      col: 24,
      props: {
        placeholder: '请输入',
        type: 'string'
      },
      widget: 'input'
    }
  }
}

const editSchema = {
  type: 'object',
  col: 24,
  properties: {
    name: {
      title: '名称',
      type: 'string',
      props: {
        placeholder: '请输入',
        type: 'string'
      },
      widget: 'input'
    }
  }
}

const formatTreeData = (data: any[], level = 0): any => {
  return data?.map((item: any) => ({
    ...item,
    level,
    children: formatTreeData(item.children, level + 1)
  }))
}

const ProjectType = defineComponent({
  name: 'ProjectType',
  props: {
    className: String,
    edit: Boolean
  },
  setup(props, ctx) {
    const { edit = true } = props
    const open = ref(false)
    const type = ref<'add' | 'edit'>('add')
    const treeData: TreeProps['treeData'] = [
      {
        title: '价目表分类',
        key: '0',
        children: [
          {
            title: '养生类',
            key: '0-0-0',
            children: [
              { title: 'leaf', key: '0-0-0-0', disableCheckbox: true },
              { title: 'leaf', key: '0-0-0-1' },
              { title: 'leaf', key: '0-0-0-2' },
              { title: 'leaf', key: '0-0-0-3' },
              { title: 'leaf', key: '0-0-0-4' },
              { title: 'leaf', key: '0-0-0-5' },
              { title: 'leaf', key: '0-0-0-6' },
              { title: 'leaf', key: '0-0-0-7' },
              { title: 'leaf', key: '0-0-0-8' },
              { title: 'leaf', key: '0-0-0-9' }
            ]
          },
          {
            title: '套餐类',
            key: '0-0-1',
            children: [
              { key: '0-0-1-0', title: 'sss' },
              { key: '0-0-1-1', title: 'sss' },
              { key: '0-0-1-2', title: 'sss' },
              { key: '0-0-1-3', title: 'sss' },
              { key: '0-0-1-4', title: 'sss' },
              { key: '0-0-1-5', title: 'sss' },
              { key: '0-0-1-6', title: 'sss' },
              { key: '0-0-1-7', title: 'sss' },
              { key: '0-0-1-8', title: 'sss' },
              { key: '0-0-1-9', title: 'sss' }
            ]
          }
        ],
        displayType: 'row',
        column: 1
      }
    ]

    const handleDelete = () => {}

    const handleSlot = {
      title: (rest: any) => {
        const { isLeaf, key, title, level } = rest
        return (
          <div key={key} class="flex justify-between items-center">
            <div class="ell">{title}</div>
            <div class="ml-[10px] shrink-0">
              {edit && (
                <PlusSquareTwoTone
                  hidden={level >= 2}
                  class="fill-primary"
                  onClick={() => {
                    open.value = true
                    type.value = 'add'
                  }}
                />
              )}
              {edit && (
                <EditTwoTone
                  class="mx-[10px] fill-primary!"
                  onClick={() => {
                    open.value = true
                    type.value = 'edit'
                  }}
                />
              )}
              {key !== '0' && edit && (
                <CloseSquareTwoTone
                  class="fill-primary!"
                  onClick={() => {
                    Modal.confirm({
                      title: '提示',
                      content: '确认删除?',
                      okText: '确定',
                      cancelText: '取消',
                      onOk: handleDelete
                    })
                  }}
                />
              )}
            </div>
          </div>
        )
      }
    }
    // @ts-ignore
    return (props) => {
      return (
        <div class={`${props.className} shrink-0 ${styles.tree}`}>
          <Tree
            treeData={formatTreeData(treeData)}
            blockNode
            v-slots={handleSlot}
            virtual
            height={500}
          ></Tree>
          <Modal
            title="新增分类"
            open={open.value}
            footer={false}
            wrapClassName={styles.modal}
            onCancel={() => {
              open.value = false
            }}
          >
            <FormRender
              schema={type.value === 'add' ? addSchema : editSchema}
              onCancel={() => {
                open.value = false
              }}
              key={type.value}
            />
          </Modal>
        </div>
      )
    }
  }
})

export default ProjectType
