import React from "react";
import styles from "./Item.module.scss";
import clsx from "clsx";

interface Props {
  type?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  readOnly?: boolean;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
}

const Item = ({ label, placeholder, className, type = "text", value, readOnly, onChange }: Props) => {
  return (
    <div className={clsx(className, styles.item)}>
      {label && <label className={styles.item__label}>{label}</label>}
      <input
        type={type}
        className={styles.item__input}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  );
};

export default Item;
