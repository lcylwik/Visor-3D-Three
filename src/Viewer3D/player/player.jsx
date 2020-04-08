import React from 'react';
import styles from './player.module.css';
import play from '../assets/play.svg';
import stop from '../assets/stop.svg'

const Player = ({ data, changeStep }) => {
  return (
    <div className={styles.PlayerContainer}>
          <div className={styles.Butons}>
              <div className={styles.Play}><img src={play}/></div>
              <div className={styles.Stop}></div>
          </div>
    </div>
  );
}

export default Player;