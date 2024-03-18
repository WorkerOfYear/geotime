import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import clsx from "clsx";

import styles from "./Video.module.scss";

type Props = {
  className?: string;
  errorText?: string;
  cameraUrl?: string;
  showVideo?: boolean;
};

const Video = ({ className, cameraUrl, errorText, showVideo }: Props) => {
  const [loadError, setLoadError] = useState(false);

  return (
    <>
      <Tabs.Root className={styles.TabsRoot} defaultValue="tab1">
        <Tabs.List className={styles.TabsList} aria-label="Manage your account">
          <div style={{ display: "flex" }}>
            <Tabs.Trigger className={styles.TabsTrigger} value="tab1">
              Камера
            </Tabs.Trigger>
            <Tabs.Trigger className={styles.TabsTrigger} value="tab2">
              Детектирование
            </Tabs.Trigger>
          </div>
          <Tabs.Content className={styles.TabsContent} value="tab1">
            <div className={clsx(className, styles.video)}>
              {showVideo ? (
                loadError ? (
                  <p>Камера {cameraUrl} не подключена</p>
                ) : (
                  <img
                    src={String(import.meta.env.VITE_STREAM_ENDPOINT) + String(cameraUrl)}
                    onError={(error) => setLoadError(true)}
                    alt=""
                  />
                )
              ) : (
                <div className={styles.video__text}>{errorText}</div>
              )}
            </div>
          </Tabs.Content>
          <Tabs.Content className="TabsContent" value="tab2">
            <div className={clsx(className, styles.video)}>
              <p>Видео с детектированием</p>
            </div>
          </Tabs.Content>
        </Tabs.List>
      </Tabs.Root>
    </>
  );
};

export default Video;
