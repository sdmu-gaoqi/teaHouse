import { Alert, Modal, Tooltip, Tree, TreeProps, message } from 'ant-design-vue'
import { Ref, computed, defineComponent, onMounted, ref, watch } from 'vue'
import styles from './index.module.scss'
import {
  PlusSquareTwoTone,
  EditTwoTone,
  CloseSquareTwoTone
} from '@ant-design/icons-vue'
import { FormRender } from 'store-operations-ui'
import common from '@/servers/common'
import { cloneDeep } from 'wa-utils'
import { transformProjectTypeTree } from '@/utils'
import { ProjectTypeItem } from '@/types'

const addSchema = {
  type: 'object',
  rules: {
    categoryName: [
      { required: true, message: '请输入名称' },
      { max: 15, message: '最多输入15个字符' }
    ]
  },
  properties: {
    parentId: {
      title: '父节点',
      type: 'string',
      widget: 'input',
      span: 0
    },
    parentName: {
      title: '父节点',
      type: 'string',
      widget: 'input',
      props: {
        bordered: false,
        readonly: true
      }
    },
    categoryName: {
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
  rules: {
    categoryName: [
      { required: true, message: '请输入名称' },
      { max: 15, message: '最多输入15个字符' }
    ]
  },
  properties: {
    id: {
      title: 'id',
      type: 'string',
      widget: 'input',
      span: 0
    },
    parentId: {
      title: '父节点',
      type: 'string',
      widget: 'input',
      span: 0
    },
    categoryName: {
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

const ProjectType = defineComponent({
  name: 'ProjectType',
  props: {
    className: String,
    edit: Boolean,
    defaultSelect: Array,
    onChange: Function,
    canSelectMain: Boolean,
    selectValue: Number
  },
  setup(props, ctx) {
    const { edit = true } = props
    const open = ref(false)
    const target = ref({
      level: 0,
      title: '',
      key: 0,
      isEdit: false,
      parentId: undefined
    })
    const type = ref<'add' | 'edit'>('add')
    const selectedKeys = ref(props.defaultSelect)
    const realSchema = computed(() => {
      const cloneAdd = cloneDeep(addSchema)
      const cloneEdit = cloneDeep(editSchema)
      if (type.value === 'add') {
        if (target.value.level !== -1) {
          cloneAdd.properties.parentId.defaultValue = target.value.key
          cloneAdd.properties.parentName.defaultValue = target.value.title
        }
        return target.value.level === -1 ? editSchema : cloneAdd
      }
      cloneEdit.properties.categoryName.defaultValue = target.value.title
      cloneEdit.properties.id.defaultValue = target.value.key
      return cloneEdit
    })
    const treeData = ref<ProjectTypeItem[]>()

    const init = async () => {
      const res: any = await common.projectTypeList()
      const data = transformProjectTypeTree(res.data)
      treeData.value = data
    }

    onMounted(() => {
      init()
    })

    watch(
      () => props.selectValue,
      () => {
        selectedKeys.value = [props.selectValue]
      }
    )

    const handleSlot = {
      title: (rest: any) => {
        const { categoryId, categoryName, level, parentId } = rest
        return (
          <Tooltip
            color="#fff"
            placement="left"
            title={
              edit ? (
                <div>
                  <PlusSquareTwoTone
                    hidden={level >= 1}
                    class="fill-primary mr-[10px]"
                    onClick={() => {
                      open.value = true
                      type.value = 'add'
                      target.value = {
                        title: categoryName,
                        key: categoryId,
                        level,
                        isEdit: false,
                        parentId
                      }
                    }}
                  />
                  {edit && level !== -1 && (
                    <EditTwoTone
                      class="mr-[10px] fill-primary!"
                      onClick={() => {
                        open.value = true
                        type.value = 'edit'
                        target.value = {
                          title: categoryName,
                          key: categoryId,
                          level,
                          isEdit: true,
                          parentId
                        }
                      }}
                    />
                  )}
                  {categoryId !== '0' && edit && (
                    <CloseSquareTwoTone
                      class="fill-primary!"
                      onClick={() => {
                        Modal.confirm({
                          title: '提示',
                          content: `确认删除${categoryName}?`,
                          okText: '确定',
                          cancelText: '取消',
                          onOk: async () => {
                            await common.deleteProjectType({
                              id: categoryId
                            })
                            message.success('删除分类成功')
                            await init()
                          }
                        })
                      }}
                    />
                  )}
                </div>
              ) : null
            }
          >
            <div
              key={categoryId}
              class="flex justify-between items-center h-[32px]"
            >
              <div class="ell">{categoryName}</div>
            </div>
          </Tooltip>
        )
      }
    }

    ctx.expose({
      selectedKeys: selectedKeys
    })

    // @ts-ignore
    return (props) => {
      return (
        <div class={`${props.className} shrink-0 ${styles.tree}`}>
          {Array.isArray(treeData.value) && (
            <div>
              <Alert
                message={
                  <div class="text-slate-950">
                    {edit && <div>悬浮在类型上可管理类型</div>}
                    <div>点击可选择项目分类</div>
                  </div>
                }
                class="mb-[10px]"
              ></Alert>
              <Tree
                treeData={treeData.value as any}
                blockNode
                v-slots={handleSlot}
                virtual
                height={500}
                fieldNames={{
                  title: 'categoryName',
                  key: 'categoryId',
                  children: 'categoryItems'
                }}
                defaultExpandAll={true}
                autoExpandParent={true}
                showLine={false}
                selectedKeys={selectedKeys.value as any}
                onSelect={(v) => {
                  props?.onChange?.(v)
                  if (v?.[0] === 0 && !props.canSelectMain) {
                    selectedKeys.value = selectedKeys.value
                    return
                  }
                  selectedKeys.value = v
                }}
              ></Tree>
            </div>
          )}
          <Modal
            title="新增分类"
            open={open.value}
            footer={false}
            wrapClassName={styles.modal}
            onCancel={() => {
              open.value = false
            }}
            destroyOnClose={true}
          >
            <FormRender
              schema={realSchema.value}
              onCancel={() => {
                open.value = false
              }}
              key={type.value + target.value.level}
              onFinish={async (value) => {
                if (type.value === 'add') {
                  await common.createProjectType(value)
                  message.success('新增分类成功')
                  await init()
                  open.value = false
                  return
                }
                await common.updateProjectType(value)
                message.success('更新分类成功')
                await init()
                open.value = false
                return
              }}
            />
          </Modal>
        </div>
      )
    }
  }
})

export default ProjectType
