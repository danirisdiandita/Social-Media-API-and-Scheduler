import React from 'react'
import Image from 'next/image'
import StartButton from './start-button'
import Link from 'next/link'


const Navbar = () => {
  return (
    <header className="border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <Link href="/" className="flex gap-3 align-middle items-center">
            <Image src="/autoposting.svg" alt="autoposting" width={75} height={75} />
            <h1 className="text-2xl sm:text-3xl font-black">autoposting.my.id</h1>
          </Link>
          <div className="flex gap-3">
            <StartButton />
          </div>
        </div>
      </header>
  )
}

export default Navbar