import React, { CSSProperties } from "react";
import clsx from "clsx";
import ClipLoader from "react-spinners/ClipLoader";

import styles from "./Table.module.scss";
import Video from "../Video";
import DetectionVideo from "../Video/DetectionVideo";
import { IReport } from "../../types/IReport";

const override: CSSProperties = {
  marginTop: "5em",
};

type TablesProps = {
  id: number;
  reports?: IReport[];
  showStream?: boolean;
  cameraUrl?: string;
  classBody?: string;
  isFetching?: boolean;
};

const Tables: React.FC<TablesProps> = ({ id, reports, cameraUrl, showStream, classBody, isFetching }) => {
  let errorText;
  if (id === 1) {
    errorText = "Видео с вибросито 1";
  } else if (id === 2) {
    errorText = "Видео с вибросито 2";
  } else if (id === 3) {
    errorText = "Видео с вибросито 3";
  }

  return (
    <div className={styles.table}>
      <div className={styles.table__content}>
        {showStream && (
          <div className={styles.table__video}>
            <Video errorText={errorText} cameraUrl={cameraUrl} showVideo={showStream} />
            <DetectionVideo errorText={errorText} cameraUrl={cameraUrl} showVideo={showStream} />
          </div>
        )}
        
        {isFetching && (
          <ClipLoader
            color={"#605dec"}
            loading={true}
            size={50}
            cssOverride={override}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}
        <div className={clsx(classBody, styles.table__body)}>
          {reports?.map((item: IReport, index: number) => (
            <div className={styles.bodyRow} key={index}>
              <div className={styles.item}>{item.created_at ? item.created_at : item.time}</div>
              <div className={styles.item}>{item.depth}</div>
              <div className={styles.item}>{item.cut_plan_volume}</div>
              <div className={styles.item}>{item.lag_depth}</div>
              <div className={styles.item}>{item.cut_plan_volume_with_out_well}</div>
              <div className={styles.item}>{item.cut_plan_volume_in_well}</div>
              <div className={styles.item}>{item.cut_fact_volume}</div>
              <div className={styles.item}>{item.cleaning_factor}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tables;
