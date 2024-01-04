import { GlobalStyles } from '@bigcommerce/big-design';
import type { AppProps } from 'next/app'
import './styles/style.css'

const MyApp = ({ Component, pageProps }: AppProps) => (
   <>
       <GlobalStyles />
       <Component {...pageProps} />
   </>
);
 
export default MyApp;