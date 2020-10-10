import React, { useEffect } from 'react';
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import Login from '../components/Login/Login';

function Home() {
  const router = useRouter();
  const [ session, loading ] = useSession();

  useEffect(() => {
    if(session) {
      router.push('/calculator');
    }
  }, [session]);

  if(loading || session) return null;
  
  return (
    <main className={styles.container}>
      <h1>LoanPro Calculator</h1>
      <span className={styles.lpLinearGradient}></span>
      <Login/>
    </main>
  )
}

export default Home;


