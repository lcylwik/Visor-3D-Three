import React from 'react';
import styles from './timeline.module.css';

const TimeLine = ({ refTL, data, changeStep }) => {
  return (
    <div ref={refTL} className={styles.TimeLineContainer}>
      {data.map((step, index) => {
        let last = index === data.length - 1;
        return (
          <div key={index} className={`${styles.StepsText} ${last ? styles.LastSteps : ''}`} onClick={(e) => changeStep(index)}>
            <div className={styles.Circle}></div>
            {index !== data.length - 1 &&
                <div className={styles.CircleInner}></div>
            }
          </div>
        )
      })}
    </div>
  );
}

export default TimeLine;