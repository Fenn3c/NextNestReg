import React from 'react'

type Props = {
    text: string
}

export default function Link({text}: Props) {
  return (
    <span className='text-blue-500 hover:text-blue-600 transition-colors cursor-pointer'>{text}</span>
  )
}