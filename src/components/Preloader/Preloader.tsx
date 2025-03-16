import React from "react";
import styles from "./Preloader.module.scss";

export const Preloader: React.FC = () => {
  return (
    <div className={styles.preloader}>
      <div className={styles.preloader__container}>
        <div className={styles.preloader__book}></div>
        <div className={styles.preloader__book}></div>
        <div className={styles.preloader__pencil}></div>
        <div className={styles.preloader__text}>Загрузка...</div>
      </div>
    </div>
  );
};
