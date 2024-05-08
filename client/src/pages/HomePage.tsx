import React from "react";

import Header from "../components/Header";
import Tables from "../components/Table";
import HeadTable from "../components/HeadTable";
import Result from "../components/Result";
import { useAppSelector } from "../hooks/redux";
import { reportApi } from "../services/ReportService";


const HomePage: React.FC = () => {
  const jobReducer = useAppSelector((state) => state.jobReducer);
  const cameraReducer = useAppSelector((state) => state.cameraReducer);
  const reports = useAppSelector((state) => state.jobReducer.savedReports);
  const last_report = reports?.at(0);

  reportApi.useGetReportMessagesQuery(null, { skip: !jobReducer.jobState });
  const isActiveCamera =
    jobReducer.job.camera1_is_active || jobReducer.job.camera2_is_active || jobReducer.job.camera3_is_active;

  let isFetching;
  console.log(jobReducer.jobState);
  if (jobReducer.jobState) {
    if (jobReducer.savedReports.length === 0) {
      isFetching = true;
      console.log("fetching");
    }
  }
  
  return (
    <div>
      <Header />
      <HeadTable />
      <div className="home__table">
        {jobReducer.job.camera1_is_active && (
          <Tables
            id={1}
            reports={reports}
            cameraUrl={cameraReducer.camera1.data.url}
            showStream={true}
            isFetching={isFetching}
          />
        )}
        {jobReducer.job.camera2_is_active && (
          <Tables
            id={2}
            reports={reports}
            cameraUrl={cameraReducer.camera2.data.url}
            showStream={true}
            isFetching={isFetching}
          />
        )}
        {jobReducer.job.camera3_is_active && (
          <Tables
            id={3}
            reports={reports}
            cameraUrl={cameraReducer.camera3.data.url}
            showStream={true}
            isFetching={isFetching}
          />
        )}
      </div>
      {isActiveCamera ? (
        <Result report={last_report} />
      ) : (
        <p style={{ marginTop: "4em" }}>Нет активных камер</p>
      )}
    </div>
  );
};

export default HomePage;
