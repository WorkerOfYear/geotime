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
    const jobState = useAppSelector((state) => state.jobReducer.jobState);
    const reports = useAppSelector((state) => selectCameraReports(props.id, state));
    reportApi.useGetReportMessagesQuery(props.id, { skip: !jobState });

    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
      if (jobState && reports?.length === 0) setIsFetching(true);
    }, [jobState]);

    return <Component {...props} reports={reports} isFetching={isFetching} />;
  };

export const WithCameraStreamTable = withCameraStream(Table);
