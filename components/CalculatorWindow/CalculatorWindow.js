import styles from './CalculatorWindow.module.css';

function CalculatorWindow({ windowList }) {
  return(
    <div className={styles.container}>
      <span>{windowList}</span>
    </div>
  )
}

export default CalculatorWindow;