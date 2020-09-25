import styles from './CalculatorWindow.module.css';

function CalculatorWindow({ numberOp }) {
  return(
    <div className={styles.container}>
      <span>{numberOp}</span>
    </div>
  )
}

export default CalculatorWindow;