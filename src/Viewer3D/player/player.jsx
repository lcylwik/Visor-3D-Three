import React from 'react';
import styles from './player.module.css';
import play from '../assets/play.svg';
import stop from '../assets/stop.svg';
import next from '../assets/next.svg';
import prev from '../assets/before.svg';

const Player = ({ data, onPlay, onStop, onPrev, onNext }) => {
  return (
    <div className={styles.PlayerContainer}>
      <div className={styles.Butons}>
        <div onClick={e => onPrev()} className={styles.Prev}><img alt="prev" src={prev} /></div>
        <div onClick={e => onPlay()} className={styles.Play}><img alt="play" src={play} /></div>
        <div onClick={e => onStop()} className={`${styles.Stop} ${styles.Hidden}`}><img alt="stop" src={stop} /></div>
        <div onClick={e => onNext()} className={styles.Next}><img alt="next" src={next} /></div>
      </div>
    </div>
  );
}

export default Player;