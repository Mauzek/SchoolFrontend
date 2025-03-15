import React, { useState } from "react";
import styles from "./Auth.module.scss";
import { message } from "antd";
import { login } from "../../api/api-utils";
import video from "../../assets/video/auth_background.mp4";

export const Auth: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      messageApi.success(response.message);
      console.log("Успешный вход:", response);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      switch (response.user.role.idRole) {
        case 1:
          localStorage.setItem(
            "user",
            JSON.stringify({id: response.user.additionalInfo.idEmployee, role: response.user.role })
          );
          break;
        case 2:
          localStorage.setItem(
            "user",
            JSON.stringify({id: response.user.additionalInfo.idEmployee, role: response.user.role })
          );
          break;
        case 3:
          localStorage.setItem(
            "user",
            JSON.stringify({id: response.user.additionalInfo.idStudent, role: response.user.role })
          );
          break;
        case 4:
          localStorage.setItem(
            "user",
            JSON.stringify(response.user.additionalInfo.idParent)
          );
          break;
      }
      // Перенаправление или другие действия после успешного входа
    } catch (error) {
      messageApi.error("Неверный логин или пароль");
      console.error("Ошибка при входе:", error);
    }
  };

  return (
    <div className={styles.auth}>
      {contextHolder}
      <video
        src={video}
        autoPlay
        muted
        loop
        className={styles.auth__video}
        onError={(e) => {
          console.error("Ошибка загрузки видео:", e);
          messageApi.error("Не удалось загрузить фоновое видео");
        }}
      >
        Ваш браузер не поддерживает видео.
      </video>
      <div className={styles.auth__overlay} />
      <section>
        <div className={styles.auth__info}>
          <h2>Добро пожаловать!</h2>
          <p>Пожалуйста, войдите в свою учетную запись, чтобы продолжить.</p>
        </div>
        <div className={styles.auth__form}>
          <h2>Вход</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles["auth__form-group"]}>
              <label htmlFor="username">Логин</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className={styles["auth__form-group"]}>
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles["auth__form-button"]}>
              Войти
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
