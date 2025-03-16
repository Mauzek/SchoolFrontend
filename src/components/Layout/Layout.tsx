import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setUser } from "../../store/userSlice";
import { Header, Preloader } from "../../components";
import {
  loginWithJWT,
  getAccessToken,
  getRefreshToken,
  saveUserToLocalStorage,
} from "../../api/api-utils";
import styles from "./Layout.module.scss";
import "../../styles/global.css";

export const Layout: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Добавляем класс к body при монтировании компонента Auth
  useEffect(() => {
    const isAuthPage = location.pathname === "/auth";

    if (isAuthPage) {
      document.body.classList.add("auth-page");
    } else {
      document.body.classList.remove("auth-page");
    }

    return () => {
      document.body.classList.remove("auth-page");
    };
  }, [location.pathname]);

  useEffect(() => {
    const autoLogin = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (accessToken && refreshToken && !user.isAuth) {
        try {
          const authResponse = await loginWithJWT(accessToken, refreshToken);

          dispatch(
            setUser({
              user: authResponse.user,
              accessToken: authResponse.accessToken,
              refreshToken: authResponse.refreshToken,
              isAuth: true,
            })
          );

          if (authResponse.tokenRefreshed) {
            saveUserToLocalStorage(authResponse);
          }

          console.log("Автоматическая авторизация успешна");
        } catch (error) {
          console.error("Ошибка автоматической авторизации:", error);
        }
      }

      setIsLoading(false);
      setAuthChecked(true);
    };

    autoLogin();
  }, []);

  useEffect(() => {
    // Выполняем перенаправление только после проверки авторизации
    if (
      authChecked &&
      !user.isAuth &&
      location.pathname !== "/auth" &&
      location.pathname !== "/"
    ) {
      navigate("/auth");
    }
  }, [user.isAuth, location.pathname, navigate, authChecked]);

  const showSidebar =
    location.pathname !== "/" && location.pathname !== "/auth";
  const isAuthPage = location.pathname === "/auth";

  // Показываем прелоадер до завершения проверки авторизации
  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div
      className={`${styles.layout} ${isAuthPage ? styles.layout__auth : ""}`}
    >
      {showSidebar && (
        <div className={styles.layout__sidebar}>
          <Header />
        </div>
      )}
      <div
        className={`
        ${styles.layout__content} 
        ${showSidebar ? styles["layout__content--with-sidebar"] : ""}
        ${isAuthPage ? styles["layout__content--auth"] : ""}
      `}
      >
        <Outlet />
      </div>
    </div>
  );
};
