import React from 'react'
import Link from 'next/link'

type Props = {
    text: string
    href: string
}

export default function A({text, href}: Props) {
  return (
    // <A>
    <Link href={href}>
    <span className='text-blue-500 hover:text-blue-600 transition-colors cursor-pointer'>{text}</span>
    </Link>
    // </A>
  )
}