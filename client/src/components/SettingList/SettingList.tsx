import React, { useEffect } from "react";
import clsx from "clsx";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

import styles from "./SettingList.module.scss";
import { useAppSelector } from "../../hooks/redux";
import { reportApi } from "../../services/ReportService";
import { useNavigate } from "react-router-dom";

interface SettingListProps {
  onSubmit: () => void;
}

const SettingList: React.FC<SettingListProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  const stream = useAppSelector(state => state.witsReducer.stream)

  const { data: witsData, isLoading } = reportApi.useGetWitsMessagesQuery(null, { skip: !stream });
  
  return (
    <div className={styles.list}>
      <div className={clsx("label", styles.list__label)}>
        Монитор входящего потока WITS
      </div>
      <div className={styles.list__body}>
        <ul>
          {!isLoading && witsData ? 
          <>
            {witsData.map((item, index) => (
              <li className={styles.item} key={index}>
                {item}
              </li>
            ))}
          </> 
          : <li className={styles.item}>No data...</li>}
        </ul>
      </div>
      <div className={styles.list__bottom}>
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
          <button onClick={onSubmit} className={clsx(styles.list__confirm, "button button--border")}>
              Применить
          </button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="AlertDialogOverlay" />
            <AlertDialog.Content className="AlertDialogContent">
              <AlertDialog.Title className="AlertDialogTitle">
                Сохранено! Перейти на главную страницу?
              </AlertDialog.Title>
              <div
                style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}
              >
                <AlertDialog.Cancel asChild>
                  <button className="button">Остаться</button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild onClick={() => navigate("/")}>
                  <button className="button button--border">На главную</button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
        {/* <button className={clsx(styles.list__cancel, "button")}>Отмена</button> */}
      </div>
    </div>
  );
};

export default SettingList;
