import { compose, renameProp } from 'recompose'
import TextInput from 'grommet/components/TextInput'

import { connectField } from '../lib/utils'

export default compose(
  connectField,
  renameProp('onChange', 'onDOMChange')
)(TextInput)
