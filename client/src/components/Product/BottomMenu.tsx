import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Link, useNavigate } from "react-router-dom";
import CustomToast from "../ui/toast/CustomToast";

type Props = {
  disabled: boolean;
  onSubmit: () => void;
};

const BottomMenu = ({ disabled, onSubmit }: Props) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="product__bottom">
        <Link className="product__link" to="/">
          На главную
        </Link>
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            {!disabled ? (
              <button disabled={disabled} className="button button--border" onClick={onSubmit}>
                Применить
              </button>
            ) : (
              <CustomToast
                handleClick={() => console.log("Toast")}
                title="Калибровка не закончена!"
                className="button button--border-disabled"
              >
                Применить
              </CustomToast>
            )}
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="AlertDialogOverlay" />
            <AlertDialog.Content className="AlertDialogContent">
              <AlertDialog.Title className="AlertDialogTitle">
                Калибровка выполнена! Перейти на главную страницу?
              </AlertDialog.Title>
              <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
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
      </div>
    </>
  );
};

export default BottomMenu;
