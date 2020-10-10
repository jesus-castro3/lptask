import { useState } from 'react';
import { signOut } from 'next-auth/client';
import styles from './Logout.module.css';
function Logout() {
  const [disabled, setDisabled] = useState(false);
  /** 
   * Ends user session on click 
   */
  const handleEndSession = async () => {
    // disable signout while in process
    setDisabled(true);
    await signOut();
    setDisabled(false)
  }
  return (
    <div className={styles.logout}>
      <button onClick={handleEndSession} disabled={disabled}>Logout</button>
    </div>
  )
}

export default Logout;