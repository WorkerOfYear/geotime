import { Switch } from "../ui/form";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { PRODUCT_ROUTE } from "../../routes";
import { jobSlice } from "../../store/reducers/JobSlice";

const link1 = PRODUCT_ROUTE + "/1";
const link2 = PRODUCT_ROUTE + "/2";
const link3 = PRODUCT_ROUTE + "/3";

const SievesSwitchers = () => {
  const jobReducer = useAppSelector((state) => state.jobReducer);

  const dispatch = useAppDispatch();

  function changeStatus1(status: boolean) {
    dispatch(jobSlice.actions.setCamera1IsActive(status));
  }
  function changeStatus2(status: boolean) {
    dispatch(jobSlice.actions.setCamera2IsActive(status));
  }
  function changeStatus3(status: boolean) {
    dispatch(jobSlice.actions.setCamera3IsActive(status));
  }

  return (
    <>
      <Switch
        title="Вибросито 1"
        link={link1}
        checked={jobReducer.job.camera1_is_active}
        onChangeStatus={changeStatus1}
        disabled={jobReducer.jobState}
      />
      <Switch
        title="Вибросито 2"
        link={link2}
        checked={jobReducer.job.camera2_is_active}
        onChangeStatus={changeStatus2}
        disabled={jobReducer.jobState}
      />
      <Switch
        title="Вибросито 3"
        link={link3}
        checked={jobReducer.job.camera3_is_active}
        onChangeStatus={changeStatus3}
        disabled={jobReducer.jobState}
      />
    </>
  );
};

export default SievesSwitchers;
