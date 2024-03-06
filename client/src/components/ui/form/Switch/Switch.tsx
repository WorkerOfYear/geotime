/// <reference types="vite-plugin-svgr/client" />

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

import styles from "./Switch.module.scss";

import EditIcon from "../../../../assets/images/icons/edit.svg?react";

type Props = {
  checked?: boolean;
  disabled?: boolean;
  title?: string;
  link: string;
  onChangeStatus: (status: boolean) => void;
};

const Switch = ({
  title,
  link,
  disabled = false,
  checked = false,
  onChangeStatus,
}: Props) => {
  const [isCheck, setIsCheck] = useState<boolean>(checked);
  const navigate = useNavigate();
  const handleOnChange = () => {
    setIsCheck(!isCheck);
  };

  useEffect(() => {
    onChangeStatus(isCheck);
    console.log(`${title}: ${isCheck}`);
  }, [isCheck]);

  return (
    <div className={styles.header__block}>
      <div
        onClick={() => navigate(link)}
        className={clsx(
          styles.block,
          !isCheck || disabled ? styles.blockDisable : null
        )}
      >
        <div className={styles.block__name}>{title}</div>
        <button className={styles.block__btn}>
          <EditIcon />
        </button>
      </div>
      <label className={styles.switch}>
        <div className={styles.switch__body}>
          <input
            type="checkbox"
            className={styles.switch__input}
            disabled={disabled}
            onChange={!disabled ? handleOnChange : undefined}
            defaultChecked={isCheck}
          />
          <span className={styles.switch__slider} />
        </div>
        <span className={styles.switch__span}>
          {isCheck ? "Включен расчет" : "Выключен расчет"}
        </span>
      </label>
    </div>
  );
};

export default Switch;
