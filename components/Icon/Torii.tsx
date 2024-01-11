import { createIcon } from '@chakra-ui/icons'

// using `path`
const ToriiIcon = createIcon({
  displayName: 'ToriiIcon',
  viewBox: '0 0 512 512',
  // path can also be an array of elements, if you have multiple paths, lines, shapes, etc.
  path: (
    <path
      d="M427.359,146.219l-0.609-5.297l-0.5-4.438h32.859V96.563h26.938L512,38.297H0l25.938,58.266h26.953v39.922
		h32.844l-1.109,9.734h0.016L76.5,217.703H10v60.016h59.672l-0.797,7.063l0,0l-0.406,3.531l-15,131.813l0,0l-6.094,53.578h75.328
		l4.375-53.578l10.766-131.813l0.297-3.531l0.578-7.063h234.563l0.594,7.063l0.25,3.531l10.781,131.813l0,0l4.391,53.578h75.328
		l-6.109-53.578l0,0l-15-131.813l-0.391-3.531l0,0l-0.188-1.563l-0.625-5.5H502v-60.016h-66.5L427.359,146.219z M282.094,136.484
		h79.625l0.813,9.734l5.844,71.484h-86.281v-71.484V136.484z M149.484,146.219l0.797-9.734h79.625v9.734v71.484h-86.281
		L149.484,146.219z"
      fill="#aaa"
    ></path>
  )
})

export default ToriiIcon
