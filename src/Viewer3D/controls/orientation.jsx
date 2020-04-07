import React from 'react';
import styles from './orientation.module.css'

const OrientationHeader = ({ changeDirection }) => {
  return (
      <div className={styles.OrientationContainer}>
        <div onClick={(e) => changeDirection('front')}  className={`${styles.Frente} ${styles.Items}`}>Frente</div>
        <div onClick={(e) => changeDirection('rigth')}  className={`${styles.Rigth} ${styles.Items}`}>Derecha</div>
        <div onClick={(e) => changeDirection('left')}  className={`${styles.Left} ${styles.Items}`}>Izquierda</div>
      </div>
    );
}

export default OrientationHeader;