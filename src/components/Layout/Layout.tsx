import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { Header } from "../Header/Header";
import {
  loginWithJWT,
  getAccessToken,
  getRefreshToken,
  saveUserToLocalStorage,
} from "../../api/api-utils";
import { setUser } from "../../store/userSlice";
import styles from "./Layout.module.scss";

export const Layout: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

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

          if (authResponse.tokenRefreshed){
            saveUserToLocalStorage(authResponse);
          }
          
          console.log("Автоматическая авторизация успешна");
        } catch (error) {
          console.error("Ошибка автоматической авторизации:", error);
        }
      }
      setIsLoading(false);
    };

    autoLogin();
  }, []);

  useEffect(() => {
    if (
      !user.isAuth &&
      location.pathname !== "/auth" &&
      location.pathname !== "/"
    ) {
      navigate("/auth");
    }
  }, [user.isAuth, location.pathname, navigate]);

  const showSidebar = location.pathname !== "/" && location.pathname !== "/auth";

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles.layout}>
      {showSidebar && <div className={styles.layout__sidebar}><Header /></div>}
      <div className={`${styles.layout__content} ${showSidebar ? styles['layout__content--with-sidebar'] : ''}`}>
        <Outlet />
      </div>
    </div>
  );
};
