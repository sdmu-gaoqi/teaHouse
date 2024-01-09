import { Tree, TreeProps } from 'ant-design-vue'
import { defineComponent } from 'vue'
import styles from './index.module.scss'
import {
  PlusSquareTwoTone,
  EditTwoTone,
  CloseSquareTwoTone
} from '@ant-design/icons-vue'

const ProjectType = defineComponent({
  name: 'ProjectType',
  props: {
    className: String
  },
  setup(props, ctx) {
    const treeData: TreeProps['treeData'] = [
      {
        title: '价目表分类',
        key: '0',
        children: [
          {
            title: 'parent 1-0',
            key: '0-0-0',
            children: [
              { title: 'leaf', key: '0-0-0-0', disableCheckbox: true },
              { title: 'leaf', key: '0-0-0-1' }
            ]
          },
          {
            title: 'parent 1-1',
            key: '0-0-1',
            children: [{ key: '0-0-1-0', title: 'sss' }]
          }
        ]
      }
    ]

    const handleSlot = {
      title: (rest: any) => {
        const { isLeaf, key, title } = rest
        return (
          <div key={key} class="flex justify-between items-center">
            <div class="ell">{title}</div>
            <div class="ml-[10px] shrink-0">
              <PlusSquareTwoTone />
              <EditTwoTone class="mx-[6px]" />
              {key !== '0' && <CloseSquareTwoTone />}
            </div>
          </div>
        )
      }
    }
    // @ts-ignore
    return (props) => {
      return (
        <div class={`${props.className} shrink-0 ${styles.tree}`}>
          <Tree treeData={treeData} blockNode v-slots={handleSlot}></Tree>
        </div>
      )
    }
  }
})

export default ProjectType
