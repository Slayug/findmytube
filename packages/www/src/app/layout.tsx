import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.scss'
import Link from 'next/link'
import Image from 'next/image'
import React from "react";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: 'FindMyTube',
  description: 'Search through Youtube subtitles ! Your best tools to find what people say on Youtube !',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <html lang="en">
        <body className={inter.className}>
          <header>
            <Link href="/" style={{fontWeight: 'bold', color: 'white'}}>
              <Image alt="findmytube logo" width="40" height="40" src="/icon.png"/>
              <h1>FINDMYTUBE</h1>
            </Link>
          </header>
          <div>
            {children}
          </div>
        </body>
      </html>
    </>
  )
}
