import React from "react";
import styles from "./HeadTable.module.scss";
import clsx from "clsx";

type Props = {
  className?: string;
};
const HeadTable = ({ className }: Props) => {
  const tableHeader = [
    "Время",
    "Глубина, мм",
    "Проходка, мм",
    "Диам.скв, мм",
    <span>Объём план, <br/>м<sup>3</sup></span>,
    <span>Расход факт, м<sup>3</sup>/с</span>,
    <span>Объем факт, м<sup>3</sup></span>,
    "Коэф-т очистки",
  ];

  return (
    <div className={clsx(className, styles.head)}>
      {tableHeader.map((item, index) => (
        <div className={styles.headRow} key={index}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default HeadTable;
