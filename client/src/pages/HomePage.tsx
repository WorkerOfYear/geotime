import React from "react";

import Header from "../components/Header";
import HeadTable from "../components/HeadTable";
import { useAppSelector } from "../hooks/redux";
import { WithCameraStreamTable } from "../components/withCameraStream";
import { WithResStreamReport } from "../components/withResStream";

const HomePage: React.FC = () => {
  const jobReducer = useAppSelector((state) => state.jobReducer);
  const cameraReducer = useAppSelector((state) => state.cameraReducer);
  const isActiveCamera =
    jobReducer.job.camera1_is_active || jobReducer.job.camera2_is_active || jobReducer.job.camera3_is_active;

  return (
    <div>
      <Header />
      <HeadTable />
      <div className="home__table">
        {jobReducer.job.camera1_is_active && (
          <WithCameraStreamTable id={1} cameraUrl={cameraReducer.camera1.data.url} showStream={true} />
        )}
        {jobReducer.job.camera2_is_active && (
          <WithCameraStreamTable id={2} cameraUrl={cameraReducer.camera2.data.url} showStream={true} />
        )}
        {jobReducer.job.camera3_is_active && (
          <WithCameraStreamTable id={3} cameraUrl={cameraReducer.camera3.data.url} showStream={true} />
        )}
      </div>
      {isActiveCamera ? <WithResStreamReport /> : <p style={{ marginTop: "4em" }}>Нет активных камер</p>}
    </div>
  );
};

export default HomePage;
