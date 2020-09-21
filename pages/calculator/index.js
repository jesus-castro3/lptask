import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {parseCookies} from 'nookies';
import BalanceBanner from '../../components/BalanceBanner/BalanceBanner';
import CalculatorKeypad from '../../components/CalculatorKeypad/CalculatorKeypad';

import styles from './calculator.module.css';
import CalculatorWindow from '../../components/CalculatorWindow/CalculatorWindow';

const OPERATIONS = {
  '+': 'add',
  '-': 'subtract',
  'x': 'times',
  '/': 'divide',
  'random': 'random',
  'root': 'root'
}
function CalculatorPage({ userData }) {
  const router = useRouter();
  if(!userData) {
    router.push('/');
  }
  const [balance, setBalance] = useState(userData.balance);
  // visual purpose only
  const [windowList, setWindowList] = useState([]);
  // structured list will be sent to the api
  const [numList, setNumList] = useState(['']);
  const [operationList, setOperationList] = useState([]);
  const [breakNum, setBreakNum] = useState(false);
  const [disableOperationPad, setDisableOperationPad] = useState(true);

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
    const operations = windowList.join('').replace(/[0-9]/g, '').split('');
    
    if (numbers.length < 2) return;

    const [first] = operations;
    const isSameOperation = operations.every(o => first === o);
    
    if(isSameOperation) {
      const [type] = operations;
      let response = await fetch(`http://localhost:3000/api/operations/${OPERATIONS[type]}`, {
        method: 'post',
        body: JSON.stringify({ numbers })
      });
      let { balance, total } = await response.json();
      setWindowList([total]);
      setBalance(balance);
    } else {
      // handle calculation with different operations e.g : 5+545/5545*44323
      let response = await fetch(`http://localhost:3000/api/operations`, {
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
    let response = await fetch(`http://localhost:3000/api/operations/random`, {
      method: 'GET',
    });
    let {
      balance,
      total
    } = await response.json();
    setBalance(balance);
    setWindowList([total]);
    setOperationList(['random']);
    setNumList(['']);
  }

  return(
    <main className={styles.mainContainer}>
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
    </main>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = parseCookies(ctx);
  if(cookies.userId) {
    let response = await fetch(`http://localhost:3000/api/user/${cookies.userId}`);
    let userData = await response.json();
    return {
      props: {
        userData
      }
    }
  }
  return {
    props: {}
  }
}

export default CalculatorPage;