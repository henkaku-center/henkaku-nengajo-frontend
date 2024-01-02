import { Fragment, ReactElement, ReactNode } from 'react'

const NewlineToBr = ({ children }: { children: ReactNode | string }) => {
  const convertEl = String(children)
    .split('\n')
    .map((str, index) => (
      <Fragment key={index}>
        {index !== 0 && <br />}
        {str}
      </Fragment>
    ))
  return <>{convertEl}</>
}
export default NewlineToBr
