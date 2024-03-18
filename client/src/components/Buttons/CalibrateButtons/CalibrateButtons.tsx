import React from "react";

import styles from "./CalibrateButtons.module.scss";
import clsx from "clsx";

const CalibrateButtons: React.FC = () => {
  return (
    <>
      <button type="button" className={clsx(styles.btn)}>
        Начать калибровку
      </button>
      <button type="button" className={clsx(styles.btn)}>
        Остановить
      </button>
    </>
  );
};

export default CalibrateButtons;
