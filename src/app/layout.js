import './globals.css'
import { Inter } from 'next/font/google'
import Wrapper from '@/Components/wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BakePricely',
  description: 'A Cake Costing Application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Wrapper> {children} </Wrapper>
      </body>
    </html>
  )
}
