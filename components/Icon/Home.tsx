import { createIcon } from '@chakra-ui/icons'

// using `path`
const HomeIcon = createIcon({
  displayName: 'HomeIcon',
  viewBox: '0 0 24 24',
  // path can also be an array of elements, if you have multiple paths, lines, shapes, etc.
  path: (
    <path
      stroke="currentColor"
      stroke-width="2"
      fill="none"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    ></path>
  )
})

export default HomeIcon
