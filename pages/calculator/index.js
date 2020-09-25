import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';

import {
  submitNumRequest,
  submitRootRequest,
  submitRandomStringRequest,
  endUserSession
} from '../../services/clientApi';
import BalanceBanner from '../../components/BalanceBanner/BalanceBanner';
import CalculatorKeypad from '../../components/CalculatorKeypad/CalculatorKeypad';
import CalculatorWindow from '../../components/CalculatorWindow/CalculatorWindow';
import RateChart from '../../components/RateChart/RateChart';
import { OPERATIONS } from '../../constants';

import styles from './calculator.module.css';

function CalculatorPage({ user, rates }) {
  const router = useRouter();

  if(!user) return <h1>Loading</h1>
  // total balance amount due will be set here 
  const [balance, setBalance] = useState(user.balance);
  // calculator string operation 
  const [numberOp, setNumberOperation] = useState('');
  // flag to wipe random string if a num operation follows it
  const [isRandomStringActive, setRandomStringActive] = useState(false);

  // redirects to home if no user is in session
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user]);

  /** Hanldles every digit press [0-9] and .
   * @param {String}
   */
  const handleNumPress = (val) => {
    if(isRandomStringActive) {
      setNumberOperation(val);
      setRandomStringActive(false);
      return;
    }
    // we can only include one decimal place in each integer operation
    if(val === '.') {
        // convert to array and flip it so we start from the last input
        if(!numberOp.length) {
          return setNumberOperation(val);
        }
        const windowListArray = numberOp.split('').reverse();
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
          setNumberOperation(numberOp + val);
        }

    } else {
      const newNumOperation = numberOp + val;
      setNumberOperation(newNumOperation);
    }
  };

  /** Handles all operation string +-/* 
   * @param {String}
  */
  const handleOperationPress = (val) => {
    const newNumOperation = isRandomStringActive ? val : numberOp + val;
    if(isRandomStringActive) {
      setNumberOperation('');
      setRandomStringActive(false);
    }
    // cant have two operations signs next to eachother BAD
    if(numberOp.length && !isNaN(numberOp[numberOp.length -1])) {
      setNumberOperation(newNumOperation);
    } else if (!numberOp.length && val === '-') {
      setNumberOperation(val);
    } else if (!numberOp.length) {
      setNumberOperation('0' + val);
    }
  };

  /** 
   * Handles all operation string +-/* 
   */
  const handleDelete = () => {
    if(numberOp.length) {
      const newNumOperation = numberOp.slice(0, numberOp.length - 1);
      setNumberOperation(newNumOperation);
    }
  }

  /**
   * Updates local state after every API request
   * @param { total: String, balance: String}
   */
  const updateCalculatorData = (total, balance) => {
    setNumberOperation(total + '');
    setBalance(balance);
  }

  /** 
   * Calls submit for sequence operations and multiple
   */
  const onSubmit = async () => {
    if (numberOp.indexOf('√') !== -1) {
      const { total, balance } = await submitRootRequest(numberOp, OPERATIONS.root);
      return updateCalculatorData(total, balance);
    }
    const numbers = numberOp.split(/\*|\+|\/|\-/);
    const operations = numberOp.replace(/[0-9]|e|\./g, '').split('');
    // avoid submitting single integer operations e.g -2, 34, 10
    if (numbers.length < 2) return;

    const [first] = operations;
    const sequentialOperation = operations.every(o => first === o);
    

    if(sequentialOperation) {
      // handles calculation for sequential operations e.g: 5+5+100+34, 4-3-3-3
      const [type] = operations;
      const { total, balance } = await submitNumRequest(numberOp, OPERATIONS[type]);
      updateCalculatorData(total, balance);      
    } else {
      // handles calculation with different operations e.g: 5+545/5545*44323
      const { total, balance } = await submitNumRequest(numberOp);
      updateCalculatorData(total, balance);
    }
  };

  /** 
   * Handles fetching random string
   */
  const handleRandomPress = async() => {
    const { balance, total } = await submitRandomStringRequest(OPERATIONS.random);
    setRandomStringActive(true);
    updateCalculatorData(total, balance);
  }

  /** 
   * Ends user session on click 
   */
  const handleEndSession = async () => {
    const { error } = await endUserSession(user.userId);
    if(error) { 
      // handle errors here
      console.log('Unable to close session')
    } else {
      router.push('/');
    }
  }

 /** 
  * Square Root handler
  * TODO: handle root operation with the rest, isolated for now
  * @param {String}
  */
  const handleRootPress = (val) => {
    if(isRandomStringActive) {
      setNumberOperation('√');
      setRandomStringActive(false);
      return;
    }
    if (numberOp[numberOp.length - 1] !== '√') {
      setNumberOperation(numberOp + '√');
    }
  }

  return(
    <main className={styles.container}>
      <div className={styles.logout}>
        <a onClick={handleEndSession}>End Session</a>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.leftContainer}>
          <BalanceBanner
            balance={balance}
          />
          <CalculatorWindow numberOp={numberOp}/>
          <CalculatorKeypad
            onNumPress={handleNumPress}
            onRandomPress={handleRandomPress}
            onRootPress={handleRootPress}
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