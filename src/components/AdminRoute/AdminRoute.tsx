// src/components/AdminRoute/AdminRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export const AdminRoute = () => {
  const user = useSelector((state: RootState) => state.user.user);

  // Проверяем, имеет ли пользователь роль администратора (id = 1)
  const isAdmin = user?.role?.id === 1;

  // Если пользователь не админ, перенаправляем на /home
  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  // Если пользователь админ, отображаем защищенный контент
  return <Outlet />;
};
