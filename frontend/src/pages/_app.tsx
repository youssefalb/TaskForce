import Layout from '@/components/Layout'
import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { DragDropContext } from 'react-beautiful-dnd'
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


const onDragEnd = (result: any) => {

  console.log("Test");
  if (!result.destination) {
    return;
  }
};



export default function App({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DragDropContext onDragEnd={onDragEnd}>
        <SessionProvider session={pageProps.session}>
          <Layout>
            <Component {...pageProps} />
            <ToastContainer />
          </Layout>
        </SessionProvider>
      </DragDropContext>
    </LocalizationProvider>

  )
}
