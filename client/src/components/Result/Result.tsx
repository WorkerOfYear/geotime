import React from "react";
import styles from "./Result.module.scss";
import { IReport } from "../../types/IReport";
import { chooseFactVolumeDelta, formatDate } from "../../utils/reports";

interface ResultProps {
  report?: IReport | null;
}

const Result = ({ report }: ResultProps) => {
  return (
    <div className={styles.result}>
      <div className={styles.result__content}>
        <div className={styles.result__text}>ИТОГ</div>
        <div className={styles.result__col}>
          <div className={styles.result__body}>
            {report ? (
              <div className={styles.bodyRow}>
                <div className={styles.item}>{formatDate(report.time)}</div>
                <div className={styles.item}>{report.depth}</div>
                <div className={styles.item}>{report.lag_depth}</div>
                <div className={styles.item}>{report.well_diam}</div>
                <div className={styles.item}>{report.cut_plan_volume}</div>
                <div className={styles.item}>{chooseFactVolumeDelta(4, report)}</div>
                <div className={styles.item}>{report.cut_fact_volume}</div>
                <div className={styles.item}>{report.cleaning_factor}</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
