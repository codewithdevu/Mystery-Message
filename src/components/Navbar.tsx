"use client"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from "next-auth"
import { Button } from './ui/button'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className='p-4 md:p-6 shadow-md bg-white w-full'>
      <div className='container mx-auto flex items-center justify-between h-10'>
        
        {/* LEFT END: Logo */}
        <div className='shrink-0'>
          <Link className='text-xl font-bold text-gray-800' href="/">
            Mystry Message
          </Link>
        </div>
        
        {/* MIDDLE: Navigation links (Only when logged in) */}
        <div className='hidden md:flex items-center gap-4 absolute left-1/2 transform -translate-x-1/2'>
          {session && (
            <>
              <Link href="/">
                <Button variant="ghost" size="sm" className='font-medium text-gray-700 hover:text-black'>
                  Home
                </Button>
              </Link>
              
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className='font-medium text-gray-700 hover:text-black'>
                  Dashboard
                </Button>
              </Link>
              
              {user?.username && (
                <Link href={`/u/${user.username}`}>
                  <Button variant="ghost" size="sm" className='font-medium text-gray-700 hover:text-black'>
                    Send Message
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>

        {/* RIGHT END: Authentication Actions */}
        <div className='shrink-0'>
          {session ? (
            <Button 
              className='bg-red-500 hover:bg-red-600 text-white font-medium' 
              size="sm" 
              onClick={() => signOut()}
            >
              Logout
            </Button>
          ) : (
            <Link href="/sign-in">
              <Button size="sm" className='font-medium'>Login</Button>
            </Link>
          )}
        </div>

      </div>

      {/* Mobile view spacing compatibility layer */}
      {session && (
        <div className='flex md:hidden items-center justify-center gap-2 mt-4 border-t pt-2'>
          <Link href="/">
            <Button variant="ghost" size="xs">Home</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="xs">Dashboard</Button>
          </Link>
          {user?.username && (
            <Link href={`/u/${user.username}`}>
              <Button variant="ghost" size="xs">Send Message</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar