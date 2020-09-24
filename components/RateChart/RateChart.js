import styles from './RateChart.module.css';

function RateChart({ rates }) {
  return(
    <section className={styles.container}>
      <h2>Rates:</h2>
      <ul>
        {rates.map(({ rate, type }) => <li key={type}><span>{type}: </span>${rate}</li>)}
      </ul>
    </section>
  );
}

export default RateChart;