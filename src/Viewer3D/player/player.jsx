import React, { useRef } from 'react';
import styles from './player.module.css';
import play from '../assets/play.svg';
import stop from '../assets/stop.svg';
import next from '../assets/next.svg';
import prev from '../assets/before.svg';

const Player = ({ data, onPlay, onStop, onPrev, onNext }) => {

  let refStop = useRef(null);
  let refPlay = useRef(null);

  return (
    <div className={styles.PlayerContainer}>
      <div className={styles.Butons}>
        <div onClick={e => onPrev()} className={styles.Prev}><img alt="prev" src={prev} /></div>
        <div ref={refPlay} onClick={e => onPlay(e.currentTarget, styles.Hidden, refStop.current)} className={styles.Play}><img alt="play" src={play} /></div>
        <div ref={refStop} onClick={e => onStop(e.currentTarget, styles.Hidden, refPlay.current)} className={`${styles.Stop} ${styles.Hidden}`}><img alt="stop" src={stop} /></div>
        <div onClick={e => onNext()} className={styles.Next}><img alt="next" src={next} /></div>
      </div>
    </div>
  );
}

export default Player;