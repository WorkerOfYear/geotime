import React, { FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import "./CustomToast.css";

type Props = {
  title: string;
  className: string;
  disabled?: boolean;
  handleClick: () => void;
};

const CustomToast = ({ title, className, disabled = false, handleClick, children }: PropsWithChildren<Props>) => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <>
      <Toast.Provider swipeDirection="right">
        <button
          className={className}
          disabled={disabled}
          onClick={() => {
            setOpen(false);
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => {
              setOpen(true);
            }, 100);
            handleClick();
          }}
        >
          {children}
        </button>

        <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
          <Toast.Title className="ToastTitle">{title}</Toast.Title>
          <Toast.Action className="ToastAction" asChild altText="Goto schedule to undo">
            <button className="Button small green">Отмена</button>
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className="ToastViewport" />
      </Toast.Provider>
    </>
  );
};

export default CustomToast;
