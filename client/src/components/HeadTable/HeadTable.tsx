import React from 'react';
import styles from "./HeadTable.module.scss";
import clsx from "clsx";

type Props = {
    className?: string
}
const HeadTable = ({className}: Props) => {
    const tableHeader = ['Время', 'Расход факт, м3/с', 'Объем факт, м3/с', 'Глубина, м', 'Проходка, м', 'Диам.скв, м', 'Объем план,м3/с', 'Коэф-т очистки']

    return (
        <div className={clsx(className, styles.head)}>
            {tableHeader.map(item => (
                <div className={styles.headRow} key={item}>{item}</div>
            ))}
        </div>
    );
};

export default HeadTable;