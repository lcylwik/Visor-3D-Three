import React from 'react';
import styles from './orientation.module.css';
import { clickHandlers } from './controllerSetup';

const OrientationHeader = ({ refOri }) => {
  return (
      <div ref={refOri} className={styles.OrientationContainer}>
        <div onClick={(e) => clickHandlers(e)}  data-direction='front' className={`${styles.Frente} ${styles.Items}`}>Frente</div>
        <div onClick={(e) => clickHandlers(e)}  data-direction='right' className={`${styles.Rigth} ${styles.Items}`}>Derecha</div>
        <div onClick={(e) => clickHandlers(e)}  data-direction='left' className={`${styles.Left} ${styles.Items}`}>Izquierda</div>
      </div>
    );
}

export default OrientationHeader;