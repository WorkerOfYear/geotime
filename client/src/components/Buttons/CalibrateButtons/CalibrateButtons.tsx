import React from "react";

import styles from "./CalibrateButtons.module.scss";
import clsx from "clsx";
import Button from "../Button";

const CalibrateButtons: React.FC = () => {
  return (
    <>
      <button type="button" className={clsx(styles.btn)}>
        Начать калибровку
      </button>
      <Button title={"Остановить"} />
    </>
  );
};

export default CalibrateButtons;
