import { createIcon } from '@chakra-ui/icons'

// using `path`
const CreateIcon = createIcon({
  displayName: 'CreateIcon',
  viewBox: '0 0 24 24',
  // path can also be an array of elements, if you have multiple paths, lines, shapes, etc.
  path: (
    <path
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    ></path>
  )
})

export default CreateIcon
