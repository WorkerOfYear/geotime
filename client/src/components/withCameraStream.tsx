import React, { useEffect, useState } from "react";

import Table from "./Table";
import { IReport } from "../types/IReport";
import { useAppSelector } from "../hooks/redux";
import { reportApi } from "../services/ReportService";
import { selectCameraReports } from "../store/reducers/JobSlice";

type BaseProps = {
  id: number;
  cameraUrl?: string;
  showStream?: boolean;
  classBody?: string;
};

type InjectedProps = {
  reports?: IReport[];
  isFetching?: boolean;
};

const withCameraStream =
  (Component: React.ComponentType<BaseProps & InjectedProps>) => (props: BaseProps) => {
    const jobReducer = useAppSelector((state) => state.jobReducer);
    const reports = useAppSelector((state) => selectCameraReports(1, state));
    reportApi.useGetReportMessagesQuery(
      {
        camera_1: jobReducer.job.camera1_is_active,
        camera_2: jobReducer.job.camera2_is_active,
        camera_3: jobReducer.job.camera3_is_active,
      },
      { skip: !jobReducer.jobState }
    );

    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
      if (jobReducer.jobState && reports?.length === 0) {
        setIsFetching(true);
      } else {
        setIsFetching(false);
      }
    }, [jobReducer.jobState, reports]);

    return <Component {...props} reports={reports} isFetching={isFetching} />;
  };

export const WithCameraStreamTable = withCameraStream(Table);
