import { Link, LinkProps } from '@chakra-ui/react'
import NextLink from 'next/link'

interface Props extends LinkProps {
  href: string
}

const CustomLink = ({ href, ...props }: Props) => {
  return (
    <NextLink href={href} passHref>
      <Link {...props} />
    </NextLink>
  )
}

export default CustomLink
