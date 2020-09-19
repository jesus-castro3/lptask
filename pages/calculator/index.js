import React, { useState } from 'react';
import BalanceBanner from '../../components/BalanceBanner/BalanceBanner';
import CalculatorKeypad from '../../components/CalculatorKeypad/CalculatorKeypad';

import styles from './calculator.module.css';
import CalculatorWindow from '../../components/CalculatorWindow/CalculatorWindow';

function CalculatorPage({ userData }) {
  const { balance } = userData;
  const [windowList, setWindowList] = useState([]);

  return(
    <main className={styles.mainContainer}>
      <BalanceBanner
        balance={balance}
      />
      <CalculatorWindow windowList={windowList}/>
      <CalculatorKeypad
        onNumPress={(val) => setWindowList([...windowList, val])}
        onDelete={()=> setWindowList(windowList.slice(0, windowList.length-1))}
        onOperationPress={(val) => setWindowList([...windowList, val])}
        onSubmit={()=> console.log('press')}
      />
    </main>
  );
}

export async function  getStaticProps() {
  let response = await fetch('http://localhost:3000/api/user/14')
  let userData = await response.json();
  return {
    props: {
      userData
    }
  }
}

export default CalculatorPage;