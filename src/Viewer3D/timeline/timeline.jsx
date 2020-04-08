import React from 'react';
import styles from './timeline.module.css';
import { } from '../controls/controllerSetup';

const TimeLine = ({ data, changeStep }) => {
  return (
    <div className={styles.TimeLineContainer}>
      {data.map((step, index) => {
        return (
          <div key={index} className={styles.StepsText} onClick={(e) => changeStep(index)}> .
            {index !== data.length - 1 &&
              <div className={styles.ContainerStepsInline}>
                <span className={styles.StepsInline}>.</span>
                <span className={styles.StepsInline}>.</span>
                <span className={styles.StepsInline} >.</span>
              </div>
            }
          </div>
        )
      })}
    </div>
  );
}

export default TimeLine;