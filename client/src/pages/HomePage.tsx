import React from "react";

import Header from "../components/Header";
import Tables from "../components/Table";
import HeadTable from "../components/HeadTable";
import Result from "../components/Result";
import { useAppSelector } from "../hooks/redux";
import { reportApi } from "../services/ReportService";

const tableInfo = [
  {
    time: "23.03.23 10:00:01",
    depth: "0,009",
    cut_plan_volume: "2500",
    lag_depth: "0,009",
    cut_plan_volume_with_out_well: "2500",
    cut_plan_volume_in_well: "0,1556",
    cut_fact_volume_1: "0,1556",
    cut_fact_volume_2: "0,1556",
    cut_fact_volume_3: "0,1556",
    cut_fact_volume: "0,1556",
    cleaning_factor: "1",
  },
  {
    time: "23.03.23 10:00:01",
    depth: "0,009",
    cut_plan_volume: "2500",
    lag_depth: "0,009",
    cut_plan_volume_with_out_well: "2500",
    cut_plan_volume_in_well: "0,1556",
    cut_fact_volume_1: "0,1556",
    cut_fact_volume_2: "0,1556",
    cut_fact_volume_3: "0,1556",
    cut_fact_volume: "0,1556",
    cleaning_factor: "1",
  },
  {
    time: "23.03.23 10:00:01",
    depth: "0,009",
    cut_plan_volume: "2500",
    lag_depth: "0,009",
    cut_plan_volume_with_out_well: "2500",
    cut_plan_volume_in_well: "0,1556",
    cut_fact_volume_1: "0,1556",
    cut_fact_volume_2: "0,1556",
    cut_fact_volume_3: "0,1556",
    cut_fact_volume: "0,1556",
    cleaning_factor: "1",
  },
  {
    time: "23.03.23 10:00:01",
    depth: "0,009",
    cut_plan_volume: "2500",
    lag_depth: "0,009",
    cut_plan_volume_with_out_well: "2500",
    cut_plan_volume_in_well: "0,1556",
    cut_fact_volume_1: "0,1556",
    cut_fact_volume_2: "0,1556",
    cut_fact_volume_3: "0,1556",
    cut_fact_volume: "0,1556",
    cleaning_factor: "1",
  },
  {
    time: "23.03.23 10:00:01",
    depth: "0,009",
    cut_plan_volume: "2500",
    lag_depth: "0,009",
    cut_plan_volume_with_out_well: "2500",
    cut_plan_volume_in_well: "0,1556",
    cut_fact_volume_1: "0,1556",
    cut_fact_volume_2: "0,1556",
    cut_fact_volume_3: "0,1556",
    cut_fact_volume: "0,1556",
    cleaning_factor: "1",
  },
  {
    time: "23.03.23 10:00:01",
    depth: "0,009",
    cut_plan_volume: "2500",
    lag_depth: "0,009",
    cut_plan_volume_with_out_well: "2500",
    cut_plan_volume_in_well: "0,1556",
    cut_fact_volume_1: "0,1556",
    cut_fact_volume_2: "0,1556",
    cut_fact_volume_3: "0,1556",
    cut_fact_volume: "0,1556",
    cleaning_factor: "1",
  },
  {
    time: "23.03.23 10:00:01",
    depth: "0,009",
    cut_plan_volume: "2500",
    lag_depth: "0,009",
    cut_plan_volume_with_out_well: "2500",
    cut_plan_volume_in_well: "0,1556",
    cut_fact_volume_1: "0,1556",
    cut_fact_volume_2: "0,1556",
    cut_fact_volume_3: "0,1556",
    cut_fact_volume: "0,1556",
    cleaning_factor: "1",
  },
  {
    time: "23.03.23 10:00:01",
    depth: "0,009",
    cut_plan_volume: "2500",
    lag_depth: "0,009",
    cut_plan_volume_with_out_well: "2500",
    cut_plan_volume_in_well: "0,1556",
    cut_fact_volume_1: "0,1556",
    cut_fact_volume_2: "0,1556",
    cut_fact_volume_3: "0,1556",
    cut_fact_volume: "0,1556",
    cleaning_factor: "1",
  },
  {
    time: "23.03.23 10:00:01",
    depth: "0,009",
    cut_plan_volume: "2500",
    lag_depth: "0,009",
    cut_plan_volume_with_out_well: "2500",
    cut_plan_volume_in_well: "0,1556",
    cut_fact_volume_1: "0,1556",
    cut_fact_volume_2: "0,1556",
    cut_fact_volume_3: "0,1556",
    cut_fact_volume: "0,1556",
    cleaning_factor: "1",
  },
];
const tableInfo2 = [
  {
    time: "",
    consumption: "",
    volume: "",
    depth: "",
    penetration: "",
    diameter: "",
    volumePlan: "",
    coefficient: "",
  },
];
const tableInfo3 = [
  {
    time: "23.03.23 10:00:01",
    consumption: "0,009",
    volume: "0,009",
    depth: "2500",
    penetration: "0",
    diameter: "0,1556",
    volumePlan: "0",
    coefficient: "1",
  },
  {
    time: "23.03.23 10:00:02",
    consumption: "0,002",
    volume: "0,011",
    depth: "2501",
    penetration: "1",
    diameter: "0,1556",
    volumePlan: "0,019",
    coefficient: "0,58",
  },
  {
    time: "23.03.23 10:00:03",
    consumption: "0,005",
    volume: "0,016",
    depth: "2501,2",
    penetration: "0,2",
    diameter: "0,1556",
    volumePlan: "0,034",
    coefficient: "0,47",
  },
];

const HomePage: React.FC = () => {
  const jobReducer = useAppSelector((state) => state.jobReducer);
  const cameraReducer = useAppSelector((state) => state.cameraReducer);
  const reports = useAppSelector((state) => state.jobReducer.savedReports);
  const last_report = reports?.at(-1);

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
            reports={tableInfo}
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
