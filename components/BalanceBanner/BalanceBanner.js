import React from 'react';
import styles from './BalanceBanner.module.css';

function BalanceBanner({ balance }) {
  const formatedBalance = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(balance);
  return(
    <section className={styles.container}>
      <div className={styles.cost}>Amount Due:</div>
      <div className={styles.balance}>{formatedBalance}</div>
    </section>
  )
}


export default BalanceBanner;