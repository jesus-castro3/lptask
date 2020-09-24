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
  '*': 'times',
  '/': 'divide',
  'random': 'random',
  'root': 'root'
};

function CalculatorPage({ user, rates }) {
  const router = useRouter();

  if(!user) return <h1>Loading</h1>

  const [balance, setBalance] = useState(user.balance);
  // visual purpose only
  const [windowList, setWindowList] = useState('');
  // structured list will be sent to the api
  const [disableOperationPad, setDisableOperationPad] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user]);

  const handleNumPress = (val) => {
    // we can only include one decimal place in each integer operation
    if(val === '.') {
        // convert to array and flip it so we start from the last input
        if(!windowList.length) {
          return setWindowList(val);
        }
        const windowListArray = windowList.split('').reverse();
        // good'ol for loop
        let addToList = false;
        for (let i = 0; i < windowListArray.length; i++) {
          const element = windowListArray[i];
          //if we find another . before another operation * / + - break out set res as false
          if(isNaN(element) && element === '.') {
            addToList = false
            break;
          } else if(isNaN(element) && element !== '.') {
            addToList = true;
            break;
          }
        }
        if(addToList) {
          setWindowList(windowList + val);
        }

    } else {
      const newWindowList = windowList + val;
      setWindowList(newWindowList);
    }
  };

  const handleOperationPress = (val) => {
    //cant have two operations next to eachoter
    const newWindowList = windowList + val;
    if(windowList.length && !isNaN(windowList[windowList.length -1])) {
      setWindowList(newWindowList);
    } else if (!windowList.length && val === '-') {
      setWindowList(val);
    } else if(!windowList.length) {
      setWindowList('0' + val);
    }
  };

  const handleDelete = () => {
    if(windowList.length) {
      const newWindowList = windowList.slice(0, windowList.length - 1);
      setWindowList(newWindowList);
    }
  }

  async function onSubmit() {
    const numbers = windowList.split(/\*|\+|\/|\-/);
    const operations = windowList.replace(/[0-9]|e|\./g, '').split('');
    
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
      setWindowList(total + '');
      setBalance(balance);
    } else {
      // handle calculation with different operations e.g : 5+545/5545*44323
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/operations`, {
        method: 'post',
        body: JSON.stringify({
          equation: windowList
        })
      });
      let {
        balance,
        total
      } = await response.json();
      setWindowList(total + '');
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
            onNumPress={handleNumPress}
            onRandomPress={handleRandomPress}
            onDelete={handleDelete}
            onOperationPress={handleOperationPress}
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
  if (cookies.userId) {
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