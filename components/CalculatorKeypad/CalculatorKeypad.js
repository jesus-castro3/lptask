import React from 'react';
import styles from './CalculatorKeypad.module.css';

const NUMERIC_KEYPAD = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0];
const OPERATIONS_KEYPAD = ['+', '-', '*', '/'];

function CalculatorKeypad({
  onNumPress,
  onOperationPress,
  onDelete,
  onRandomPress,
  onRootPress,
  onSubmit
}) {
  return(
    <section className={styles.container}>
      <div className={styles.numericPad}>
        {NUMERIC_KEYPAD.map((num) => (
          <button key={num} onClick={(e) => onNumPress(e.target.textContent)}>
            {num}
          </button>
          )
        )}
      </div>
      <div className={styles.operationsPad}>
        {OPERATIONS_KEYPAD.map((num) => (
          <button key={num} onClick={(e) => onOperationPress(e.target.textContent)} className={styles.numericPadItem}>
            {num}
          </button>
          )
        )}
      </div>
      <div className={styles.resultsPad}>
        <button onClick={onDelete}>CE</button>
        <button onClick={onRootPress}>Root</button>
        <button onClick={onRandomPress}>Random</button>
        <button onClick={onSubmit}>=</button>
      </div>
    </section>
  )
}

export default CalculatorKeypad;