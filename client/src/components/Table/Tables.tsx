import React, { CSSProperties } from "react";
import clsx from "clsx";
import ClipLoader from "react-spinners/ClipLoader";

import styles from "./Table.module.scss";
import Video from "../Video";
import DetectionVideo from "../Video/DetectionVideo";
import { IReport } from "../../types/IReport";
import { chooseFactVolume, formatDate, chooseFactVolumeDelta } from "../../utils/reports";

const override: CSSProperties = {
  marginTop: "5em",
};

type TablesProps = {
  id: number;
  reports?: IReport[];
  cameraUrl?: string;
  showStream?: boolean;
  classBody?: string;
  isFetching?: boolean;
};

const Tables: React.FC<TablesProps> = ({ id, reports, cameraUrl, showStream, classBody, isFetching }) => {
  return (
    <div className={styles.table}>
      <div className={styles.table__content}>
        {showStream && (
          <div className={styles.table__video}>
            <Video errorText={`Видео с камеры №${id}`} cameraUrl={cameraUrl} />
            <DetectionVideo errorText={`Видео с камеры №${id}`} cameraUrl={cameraUrl} />
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
              <div className={styles.item}>{formatDate(item.created_at ? item.created_at : item.time)}</div>
              <div className={styles.item}>{item.depth}</div>
              <div className={styles.item}>{item.lag_depth}</div>
              <div className={styles.item}>{item.well_diam}</div>
              <div className={styles.item}>{item.cut_plan_volume}</div>
              <div className={styles.item}>{chooseFactVolumeDelta(id, item)}</div>
              <div className={styles.item}>{chooseFactVolume(id, item)}</div>
              <div className={styles.item}>{item.cleaning_factor}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tables;
