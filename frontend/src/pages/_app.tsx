import Layout from '@/components/Layout'
import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { DragDropContext} from 'react-beautiful-dnd'



const onDragEnd = (result: any) => {

  console.log("Test");
  if (!result.destination) {
    return;
  }
};



export default function App({ Component, pageProps }: AppProps) {
  return(
      <DragDropContext onDragEnd={onDragEnd}>
        <SessionProvider session={pageProps.session}>

        <Layout>
         <Component {...pageProps} />
        </Layout>
        </SessionProvider>
      </DragDropContext>
  )
}
