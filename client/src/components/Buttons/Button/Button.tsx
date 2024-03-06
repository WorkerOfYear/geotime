import React from "react";
import styles from "./Button.module.scss";

type Props = {
    title: string;
    state?: boolean;
    onClick?: React.MouseEventHandler;
};
const Button: React.FC<Props> = ({ title, onClick }) => {
    return (
        <button type="button" className={styles.btn} onClick={onClick}>
            {title}
        </button>
    );
};

export default Button;
