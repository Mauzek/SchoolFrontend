import React, { useState, useEffect } from "react";
import styles from "./Auth.module.scss";
import video from "../../assets/video/auth_background.mp4";
import { message } from "antd";
import { login, saveUserToLocalStorage } from "../../api/api-utils";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Навигация после обновления состояния
  useEffect(() => {
    if (user.isAuth) {
      navigate("/home", { state: { role: user.user.role.id } });
    }
  }, [user.isAuth, navigate, user.user.role.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      dispatch(setUser({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isAuth: true,
      }));
      messageApi.success(response.message);
      saveUserToLocalStorage(response);
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
      />
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
