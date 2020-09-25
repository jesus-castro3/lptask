import React, { useEffect, useState } from 'react';
import styles from './BalanceBanner.module.css';
import Decimal from 'decimal.js';

function BalanceBanner({ balance, rates, rateType }) {
  const formatedBalance = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(balance);
  const [animate, setAnimation] = useState(false);
  const { rate } = (rateType) ? rates.find(r => r.type === rateType) : false;


  useEffect(() => {
    if(Number(balance) > 0) {
      setAnimation(true);
      setTimeout(() => {
        setAnimation(false);
      }, 1500);
    }
  }, [balance])

  return(
    <section className={styles.container}>
      { rate && <span className={`${styles.rate} ${animate && styles.rateAnimation}`}>+${rate}</span>}
      <div className={styles.cost}>Amount Due:</div>
      <div className={styles.balance}> 
        {formatedBalance} 
      </div>
    </section>
  )
}


export default BalanceBanner;