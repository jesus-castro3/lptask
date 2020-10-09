import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

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
    <div className={styles.container}>
      <h1>LoanPro Calculator</h1>
      <span className={styles.lpLinearGradient}></span>
      <div className={styles.loginContainer}>
      <h4>Start by login in with one of these providers</h4>
      <ul className={styles.loginContainer}>
        <li>
          <button onClick={() => signIn('github')}>Sign in using Github</button>
        </li>  
      </ul> 
      </div>
    </div>
  )
}

export default Home;


