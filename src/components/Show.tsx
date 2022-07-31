interface Props {
  when?: boolean
  children: JSX.Element
  fallback?: JSX.Element
}

const Show = ({ when, children, fallback }: Props) => (when ? children : fallback || null)

export default Show
