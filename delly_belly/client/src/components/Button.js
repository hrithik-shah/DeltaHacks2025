import React from 'react'

export default function Button({ children }) {
  return (
    <button className="relative flex items-center justify-center h-12 px-6 text-base font-sans font-normal text-[#111] bg-[#fee6e3] border-2 border-[#111] rounded-lg cursor-pointer box-border hover:outline-0 active:bg-[#ffdeda]">{children}</button>
  )
}
