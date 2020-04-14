import React, { useRef } from 'react';
import styles from './player.module.css';
import play from '../assets/play.svg';
import stop from '../assets/stop.svg';

const Player = ({ data, onPlay, onStop, onPrev, onNext }) => {

  let refStop = useRef(null);
  let refPlay = useRef(null);

  return (
    <div className={styles.PlayerContainer}>
      <div className={styles.Butons}>
        <div ref={refPlay} onClick={e => onPlay(e.currentTarget, styles.Hidden, refStop.current)} className={styles.Play}><img alt="play" src={play} /></div>
        <div ref={refStop} onClick={e => onStop(e.currentTarget, styles.Hidden, refPlay.current)} className={`${styles.Stop} ${styles.Hidden}`}><img alt="stop" src={stop} /></div>
      </div>
    </div>
  );
}

export default Player;