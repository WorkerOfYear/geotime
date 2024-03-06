import React from 'react';
import styles from './ButtonSm.module.scss'
import {Link} from "react-router-dom";

type Props = {
    title: string,
    path: string
}
const ButtonSm = ({title, path}: Props) => {
    return (
        <Link className={styles.link} to={path}>
            {title}
        </Link>
    );
};

export default ButtonSm;