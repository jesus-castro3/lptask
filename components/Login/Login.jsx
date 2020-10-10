import { signIn } from 'next-auth/client'
import styles from './Login.module.css';

function Login() {
  return(
    <fieldset className={styles.loginContainer}>
      <legend>Start by login in with one of these providers</legend>
      <ul>
        <li>
          <button onClick={() => signIn('github')}>Sign in with Github <img src="/assets/github.png" alt="" /></button>
        </li>
        <li>
          <button onClick={() => signIn('google')}>Sign in with Google <img src="/assets/google.jpg" alt="" /></button>
        </li>
      </ul>
    </fieldset>
  )
}

export default Login;