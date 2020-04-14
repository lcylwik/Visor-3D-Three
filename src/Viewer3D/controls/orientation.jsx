import React from 'react';
import styles from './orientation.module.css';
import { clickHandlers } from './controllerSetup';

const OrientationHeader = ({ refOri }) => {
  return (
      <div ref={refOri} className={styles.OrientationContainer}>
        <div onClick={(e) => clickHandlers(e, styles.Active)}  data-direction='right' className={`${styles.Items}`}>Derecha</div>
        <div onClick={(e) => clickHandlers(e, styles.Active)}  data-direction='front' className={`${styles.Active} ${styles.Items}`}>Frente</div>
        <div onClick={(e) => clickHandlers(e, styles.Active)}  data-direction='left' className={`${styles.Items}`}>Izquierda</div>
      </div>
    );
}

export default OrientationHeader;