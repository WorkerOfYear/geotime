import React from "react";
import styles from "./ButtonAccent.module.scss";
import clsx from "clsx";

type Props = {
  title: string;
  state?: boolean;
  onClick?: React.MouseEventHandler;
};
const ButtonAccent: React.FC<Props> = ({ title, state, onClick }) => {
  return (
    <button type="button" className={clsx(styles.btn)} disabled={state} onClick={onClick}>
      {title}
    </button>
  );
};

export default ButtonAccent;
