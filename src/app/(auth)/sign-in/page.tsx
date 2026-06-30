"use client"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 m-4 rounded-md shadow-md transition-all duration-200 block mx-auto w-fit" onClick={() => signIn()}>Sign in</button>
    </>
  )
}