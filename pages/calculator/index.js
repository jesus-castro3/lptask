import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {parseCookies} from 'nookies';
import BalanceBanner from '../../components/BalanceBanner/BalanceBanner';
import CalculatorKeypad from '../../components/CalculatorKeypad/CalculatorKeypad';

import styles from './calculator.module.css';
import CalculatorWindow from '../../components/CalculatorWindow/CalculatorWindow';
import RateChart from '../../components/RateChart/RateChart';

const OPERATIONS = {
  '+': 'add',
  '-': 'subtract',
  'x': 'times',
  '/': 'divide',
  'random': 'random',
  'root': 'root'
};

function CalculatorPage({ user, rates }) {
  const router = useRouter();
  if(!user) return <h1>Loading</h1>

  const [balance, setBalance] = useState(user.balance);
  // visual purpose only
  const [windowList, setWindowList] = useState([]);
  // structured list will be sent to the api
  const [disableOperationPad, setDisableOperationPad] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user]);
  const handleNumPress = (val) => {
    setDisableOperationPad(false);
    // we only allow one decimal(.) aggregation
    setWindowList([...windowList, val]);
  };

  const handleOperationPress = (val) => {
    setDisableOperationPad(true);
    // make sure the last item is a num not another operation char
    setWindowList([...windowList, val]);
  };

  const handleDelete = () => {
    if(windowList.length) {
      const newWindowList = windowList.slice(0, windowList.length - 1);
      setWindowList(newWindowList);
    }
  }

  async function onSubmit() {
    const numbers = windowList.join('').split(/x|\+|\/|\-/);
    const operations = windowList.join('').replace(/[0-9]|e|\./g, '').split('');
    
    if (numbers.length < 2) return;

    const [first] = operations;
    const isSameOperation = operations.every(o => first === o);
    
    if(isSameOperation) {
      const [type] = operations;
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/operations/${OPERATIONS[type]}`, {
        method: 'post',
        body: JSON.stringify({ numbers })
      });
      let { balance, total } = await response.json();
      setWindowList([total]);
      setBalance(balance);
    } else {
      // handle calculation with different operations e.g : 5+545/5545*44323
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/operations`, {
        method: 'post',
        body: JSON.stringify({
          numbers,
          operations
        })
      });
      let {
        balance,
        total
      } = await response.json();
      setWindowList([total]);
      setBalance(balance);
    }
  };

  async function handleRandomPress() {
    let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/operations/random`, {
      method: 'get',
    });
    let {
      balance,
      total
    } = await response.json();
    setBalance(balance);
    setWindowList([total]);
  }

  async function closeUserSession() {
    let userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${user.userId}`, {
      method: 'delete'
    });
    await userResponse.text().then( res => {
      router.push('/');
    });
  }

  return(
    <main className={styles.container}>
      <div className={styles.logout}>
        <a onClick={closeUserSession}>Close Session</a>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.leftContainer}>
          <BalanceBanner
            balance={balance}
          />
          <CalculatorWindow windowList={windowList}/>
          <CalculatorKeypad
            disableOperationPad={disableOperationPad}
            onNumPress={(val) => handleNumPress(val)}
            onRandomPress={handleRandomPress}
            onDelete={handleDelete}
            onOperationPress={(val) => handleOperationPress(val)}
            onSubmit={onSubmit}
          />
        </div>
        <RateChart rates={rates}/>
      </div>
    </main>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = parseCookies(ctx);
  console.log(ctx.setHeader);
  if(cookies.userId) {
    let userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${cookies.userId}`);
    let ratesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rates`);
    let { rates } = await ratesResponse.json();
    let user = await userResponse.json();
    return {
      props: {
        user,
        rates
      }
    }
  } else {  
    ctx.res.statusCode = 302
    ctx.res.setHeader('Location', `/`)
  }
  return {
    props: {}
  }
}

export default CalculatorPage;