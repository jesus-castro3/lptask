import React, { useState } from 'react';
import BalanceBanner from '../../components/BalanceBanner/BalanceBanner';
import CalculatorKeypad from '../../components/CalculatorKeypad/CalculatorKeypad';

import styles from './calculator.module.css';
import CalculatorWindow from '../../components/CalculatorWindow/CalculatorWindow';

function CalculatorPage({ userData }) {
  const [balance, setBalance] = useState(userData.balance);
  // visual purpose only
  const [windowList, setWindowList] = useState([]);
  // structured list will be sent to the api
  const [numList, setNumList] = useState(['']);
  const [operationList, setOperationList] = useState([]);
  const [breakNum, setBreakNum] = useState(false);

  const handleNumPress = (val) => {
    // we only allow one decimal(.) aggregation
    if (Number(val)) {
      setWindowList([...windowList, val]);
      handleKeyPress(val);
    } else if (windowList.indexOf('.') === -1) {
      setWindowList([...windowList, val]);
      handleKeyPress(val);
    }
  };

  const handleOperationPress = (val) => {
    // make sure the last item is a num not another operation char
    if (Number(windowList[windowList.length - 1])) {
      setWindowList([...windowList, val]);
      handleKeyPress(val)
    }
  };

  const handleKeyPress = (val) => {
    if (Number(val) || val === '.' && numList.indexOf('.') === -1) {
      if(breakNum) {
        setNumList([...numList, val]);
        setBreakNum(false);
      } else {
        let current = numList[numList.length - 1];
        current += val;
        numList[numList.length - 1] = current;
        setNumList([...numList]);
      }
    }
    if(!Number(val) && val !== '.') {
      setOperationList([...operationList, val]);
      setBreakNum(true)
    }
  }

  const handleDelete = () => {
    setWindowList(windowList.slice(0, windowList.length - 1))
    if(windowList[windowList.length - 1] === operationList[operationList.length -1]) {
      setOperationList(operationList.slice(0, operationList.length-1))
    } else {
      let lastIdx = numList.length - 1;
      let currentString = numList[lastIdx];
      let newString = currentString.slice(0, currentString.length - 1);
      if(newString.length) {
        numList[lastIdx] = newString;
        setNumList([...numList]);
      } else {
        setNumList(numList.slice(0, numList.length - 1));
      }
    }
  }

  async function onSubmit() {
    if (operationList.length === 1) {
      let [type] = operationList;
      let response = await fetch(`http://localhost:3000/api/operations/add`, { 
        method: 'post', 
        body: JSON.stringify({ numbers: numList}), 
      });
      let userData = await response.json();
      setBalance(userData.balance);
      console.log('RESULTS::', userData);

    }
  };

  return(
    <main className={styles.mainContainer}>
      <BalanceBanner
        balance={balance}
      />
      <CalculatorWindow windowList={windowList}/>
      <CalculatorKeypad
        onNumPress={(val) => handleNumPress(val)}
        onDelete={()=> handleDelete()}
        onOperationPress={(val) => handleOperationPress(val)}
        onSubmit={() => onSubmit()}
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