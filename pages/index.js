import { useState, useRef, useEffect } from 'react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

export default function Home() {
  const userInputRef = useRef(null);
  const [user, setUser] = useState('');
  const [disableForm, setDisableForm] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    if(userInputRef) {
      userInputRef.current.focus();
    }
  }, 
  [userInputRef])

  const checkAlphanumeric = new RegExp(/^[a-zA-Z0-9_]*$/);
  const userMaxConstrain = s => s.length <= 15
  const userMinConstrain = s => s.length >= 5

  const handleUserInput = (e) => {
    const value = e.target.value;
    if (checkAlphanumeric.test(value) && userMaxConstrain(value)) {
      if (userMaxConstrain(value) && userMinConstrain(value)) {
        setDisableForm(false);
      } else {
        setDisableForm(true);
      }
      setUser(value);
    }
  }

  const handleSubmit =  async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: 'post',
        body: JSON.stringify({ user })
      });
  
      const body = await response.json();
      if(body.error) {
        console.error(body.error)
      } else {
        router.push('/calculator');
      }
      
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className={styles.container}>
      <h1>LoanPro Calculator</h1>
      <div className={styles.lpLinearGradient}></div>
      <h4>create a temp user to start</h4>
      <form onSubmit={handleSubmit}>
        <input value={user} onChange={handleUserInput} ref={userInputRef}/>
        <button type="submit" disabled={disableForm}>Create User</button>
      </form>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const cookies = parseCookies(ctx);
  if(cookies.userId) {
    ctx.res.statusCode = 302;
    ctx.res.setHeader('Location', '/calculator');
  }
  return {
    props: {}
  }
}


