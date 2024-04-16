import React from "react";

import styles from "./CalibrateButtons.module.scss";
import clsx from "clsx";
import CustomToast from "../../ui/toast/CustomToast";

interface Props {
  disabledStart: boolean;
  disabledStop: boolean;
  onStart: () => void;
  onStop: () => void;
}

const CalibrateButtons = ({ disabledStart, disabledStop, onStart, onStop }: Props) => {
  return (
    <>
      <button type="button" disabled={disabledStart} onClick={onStart} className={clsx(styles.btn)}>
        Начать калибровку
      </button>
      <CustomToast
        title="Для окончания калибровки введите фактический объём и чувствительнсть"
        disabled={disabledStop}
        handleClick={onStop}
        className={clsx(styles.btn)}
      >
        Остановить
      </CustomToast>
    </>
  );
};

export default CalibrateButtons;
