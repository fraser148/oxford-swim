import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'Oxford Swim Discharge Watch',
  description: 'Check the last time there was a discharge upstream of your location.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5670628547065791"
        crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className}>{children}<Analytics /></body>
    </html>
  )
}
