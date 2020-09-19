import styles from './CalculatorWindow.module.css';

function CalculatorWindow({ windowList }) {
  return(
    <div className={styles.container}>
      <ul>
        {windowList.map((n) => <li>{n}</li>)}
      </ul>
    </div>
  )
}

export default CalculatorWindow;