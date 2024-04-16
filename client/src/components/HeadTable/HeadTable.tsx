import React from "react";
import styles from "./HeadTable.module.scss";
import clsx from "clsx";

type Props = {
  className?: string;
};
const HeadTable = ({ className }: Props) => {
  const tableHeader = [
    "Время",
    "Глубина, м",
    "Проходка, м",
    "Диам.скв, м",
    <span>Объём план,мм<sup>3</sup>/с</span>,
    <span>Расход факт, мм<sup>3</sup>/с</span>,
    <span>Обёем факт, мм<sup>3</sup>/с</span>,
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
