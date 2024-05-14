import React, { useEffect, useState } from "react";

import { IReport } from "../types/IReport";
import { useAppSelector } from "../hooks/redux";
import { reportApi } from "../services/ReportService";
import Result from "./Result";

type InjectedProps = {
  report: IReport | null;
};

const withResStream = (Component: React.ComponentType<InjectedProps>) => () => {
  const jobState = useAppSelector((state) => state.jobReducer.jobState);
  const report = useAppSelector((state) => state.jobReducer.savedResReport);
  reportApi.useGetResReportMessagesQuery(null, { skip: !jobState });

  return <Component report={report} />;
};

export const WithResStreamReport = withResStream(Result);
