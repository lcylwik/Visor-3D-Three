import React from 'react';
import styles from './timeline.module.css';

const TimeLine = ({ data, changeStep }) => {
  return (
    <div className={styles.TimeLineContainer}>
      {data.map((step, index) => {
        return (
          <div key={index} className={styles.StepsText} onClick={(e) => changeStep(index)}> ·
            {index !== data.length - 1 &&
              <div className={styles.ContainerStepsInline}>
                <div className={styles.StepsInline}>·</div>
                <div className={styles.StepsInline}>·</div>
                <div className={styles.StepsInline} >·</div>
              </div>
            }
          </div>
        )
      })}
    </div>
  );
}

export default TimeLine;