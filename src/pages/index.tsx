import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { stripe } from '../services/stripe';
import { SubscribeButton } from './components/SubscribeButton';

import styles from './home.module.scss';
interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}
export default function Home({ product }: HomeProps) {
  // return [    
  //   <Head>
  //     <title>Inicio | ig.news</title>
  //   </Head>,    
  //   <h1 className={styles.title}>      
  //     Hello <span>World</span></h1>
  // ]
  //as duas formas de fazer sao validas
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>✌️ Hey, Welcome</span>
          <h1>News about the <span>React</span> world</h1>
          <p>Get acess to all the publications<br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1JVG1dEIgRdUxDqo6j6GkKPf', {
    expand: ['product']
  });
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };
  return {
    props: {
      product,
    },
    revalidate: 60*60*24, //24 horas
  };
}