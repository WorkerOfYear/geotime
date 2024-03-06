import React from "react";
import styles from "./ButtonAccent.module.scss";

type Props = {
    title: string;
    state?: boolean;
    onClick?: React.MouseEventHandler;
};
const ButtonAccent: React.FC<Props> = ({ title, state, onClick }) => {
    return (
        <button type="button" className={styles.btn} disabled={state} onClick={onClick}>
            {title}
        </button>
    );
};

export default ButtonAccent;
