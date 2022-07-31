import { Link } from '@chakra-ui/react'
import NextLink from 'next/link'

interface Props {
  children: JSX.Element[]
  href: string
}

const CustomLink = ({ children, href, ...props }: Props) => {
  return (
    <NextLink href={href} passHref>
      <Link {...props}>{children}</Link>
    </NextLink>
  )
}

export default CustomLink
