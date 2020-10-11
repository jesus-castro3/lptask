import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import { getSession, useSession } from 'next-auth/client'

import {
  submitNumRequest,
  submitRootRequest,
  submitRandomStringRequest,
} from '../../services/clientApi';
import Logout from '../../components/Logout/Logout';
import BalanceBanner from '../../components/BalanceBanner/BalanceBanner';
import CalculatorKeypad from '../../components/CalculatorKeypad/CalculatorKeypad';
import CalculatorWindow from '../../components/CalculatorWindow/CalculatorWindow';
import RateChart from '../../components/RateChart/RateChart';
import { OPERATIONS_UI } from '../../constants';

import styles from './calculator.module.css';

function CalculatorPage({ balance, rates }) {
  const router = useRouter();
  const [ session, loading ] = useSession();
  // total balance amount due will be set here 
  const [currentBalance, setBalance] = useState(balance);
  // calculator string operation 
  const [numberOp, setNumberOperation] = useState('');
  // flag to wipe random string if a num operation follows it
  const [isRandomStringActive, setRandomStringActive] = useState(false);
  // set rate type for banner animation
  const [rateType, setRateType] = useState();

  // redirects to home if no user is in session
  useEffect(() => {
    if (!session) {
      router.push('/');
    }
  }, [session]);

  if (loading) return <h1>Loading</h1>
  if (!session) {
    // redirect back to homepage when we lose session or logout
    router.push('/');
    return;
  }

  const { user } = session;

  /** Handles every digit press [0-9] and .
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
      const { total, balance } = await submitRootRequest(numberOp, OPERATIONS_UI.root);
      updateCalculatorData(total, balance);
      setRateType(OPERATIONS_UI.root);
      return;
    }
    const numbers = numberOp.split(/\*|\+|\/|\-/);
    const operations = numberOp.replace(/[0-9]|e|\./g, '').split('');
    // avoid submitting single integer operations e.g -2, 34, 10
    if (numbers.length < 2) return;

    const [first] = operations;
    const sequentialOperation = operations.every(o => first === o);
    

    if(sequentialOperation) {
      // handles calculation for sequential operations e.g: 5+5+10+34, 4-3-3-3
      const [type] = operations;
      const { total, balance } = await submitNumRequest(numberOp, OPERATIONS_UI[type]);
      setRateType(OPERATIONS_UI[type]);
      updateCalculatorData(total, balance);      
    } else {
      // handles calculation with different operations e.g: 5+545/5545*44323
      const { total, balance } = await submitNumRequest(numberOp, OPERATIONS_UI.equation);
      setRateType(OPERATIONS_UI.random);
      updateCalculatorData(total, balance);
    }
  };

  /** 
   * Handles fetching random string
   */
  const handleRandomPress = async() => {
    const { balance, total } = await submitRandomStringRequest(OPERATIONS_UI.random);
    setRandomStringActive(true);
    setRateType(OPERATIONS_UI.random);
    updateCalculatorData(total, balance);
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
      <Logout/>
      <div className={styles.mainContainer}>
        <div className={styles.leftContainer}>
          <BalanceBanner
            balance={currentBalance}
            rates={rates}
            rateType={rateType}
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
  const session = await getSession(ctx);
  const prisma = new PrismaClient();
  if (session) {
    const rates = await prisma.rate.findMany();
    const { balance } = await prisma.balance.findOne({
      select: { balance: true },
      where: { userId: session.user.id }
    });
    return {
      props: {
        rates,
        balance
      }
    }
  } else {
    ctx.res.statusCode = 302;
    ctx.res.setHeader('Location', '/');
    return {
      props: {}
    }
  }
}

export default CalculatorPage;