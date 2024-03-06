import React from "react";

import ButtonAccent from "../ButtonAccent";
import Button from "../Button";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { startJob } from "../../../store/reducers/actions/ActionCreators";
import { jobSocket, reportApi } from "../../../services/ReportService";

const JobButtons: React.FC = () => {
  const dispatch = useAppDispatch();
  const jobReducer = useAppSelector((state) => state.jobReducer);

  const handleStartOnClick = () => {
    dispatch(reportApi.util.resetApiState());
    dispatch(startJob(jobReducer.job));
  };

  const handleStopOnClick = () => {
    jobSocket.close()
  };

  return (
    <>
      <ButtonAccent
        title={"Старт"}
        state={jobReducer.jobState}
        onClick={handleStartOnClick}
      />
      <Button title={"Стоп"} state={jobReducer.jobState} onClick={handleStopOnClick} />
    </>
  );
};

export default JobButtons;
