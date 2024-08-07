import { FormRender } from 'store-operations-ui'
import { defineComponent } from 'vue'
import { editSchema } from './config'

export default defineComponent(() => {
  return () => {
    return <FormRender schema={editSchema}></FormRender>
  }
})
