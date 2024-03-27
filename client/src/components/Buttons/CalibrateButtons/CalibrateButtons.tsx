import React from "react";

import styles from "./CalibrateButtons.module.scss";
import clsx from "clsx";

interface Props {
  disabled: boolean;
  onStart: () => void;
  onStop: () => void;
}

const CalibrateButtons = ({ disabled, onStart, onStop }: Props) => {
  return (
    <>
      <button type="button" disabled={disabled} onClick={onStart} className={clsx(styles.btn)}>
        Начать калибровку
      </button>
      <button type="button" onClick={onStop} className={clsx(styles.btn)}>
        Остановить
      </button>
    </>
  );
};

export default CalibrateButtons;
