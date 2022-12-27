import { createIcon } from '@chakra-ui/icons'

// using `path`
const CollectionIcon = createIcon({
  displayName: 'CollectionIcon',
  viewBox: '0 0 24 24',
  // path can also be an array of elements, if you have multiple paths, lines, shapes, etc.
  path: (
    <path
      stroke="currentColor"
      stroke-width="2"
      fill="none"
      d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
    ></path>
  )
})

export default CollectionIcon
