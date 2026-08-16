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
    <nav className='border-b border-white/[0.08] bg-[#09090b]'>
      <div className='container mx-auto flex items-center justify-between h-14 px-4 md:px-6'>
        
        {/* Logo */}
        <div className='shrink-0'>
          <Link className='text-[15px] font-semibold tracking-tight text-zinc-50' href="/">
            Mystery Message
          </Link>
        </div>
        
        {/* Center Nav — Desktop */}
        <div className='hidden md:flex items-center gap-1'>
          {session && (
            <>
              <Link href="/">
                <Button variant="ghost" size="sm" className='text-[13px] text-zinc-400 hover:text-zinc-50 hover:bg-white/[0.06]'>
                  Home
                </Button>
              </Link>
              
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className='text-[13px] text-zinc-400 hover:text-zinc-50 hover:bg-white/[0.06]'>
                  Dashboard
                </Button>
              </Link>
              
              {user?.username && (
                <Link href={`/u/${user.username}`}>
                  <Button variant="ghost" size="sm" className='text-[13px] text-zinc-400 hover:text-zinc-50 hover:bg-white/[0.06]'>
                    Send Message
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>

        {/* Auth Actions */}
        <div className='shrink-0'>
          {session ? (
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
              className='text-[13px] text-zinc-400 hover:text-zinc-50 hover:bg-white/[0.06]'
            >
              Log out
            </Button>
          ) : (
            <Link href="/sign-in">
              <Button size="sm" className='text-[13px] bg-zinc-50 text-zinc-900 hover:bg-zinc-200 font-medium h-8 px-3'>Log in</Button>
            </Link>
          )}
        </div>

      </div>

      {/* Mobile Nav */}
      {session && (
        <div className='flex md:hidden items-center justify-center gap-1 px-4 pb-3'>
          <Link href="/">
            <Button variant="ghost" size="sm" className='text-[12px] text-zinc-400 hover:text-zinc-50 h-7 px-2'>Home</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className='text-[12px] text-zinc-400 hover:text-zinc-50 h-7 px-2'>Dashboard</Button>
          </Link>
          {user?.username && (
            <Link href={`/u/${user.username}`}>
              <Button variant="ghost" size="sm" className='text-[12px] text-zinc-400 hover:text-zinc-50 h-7 px-2'>Send Message</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar