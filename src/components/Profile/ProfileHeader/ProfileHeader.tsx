import React, { useState } from "react";
import styles from "./ProfileHeader.module.scss";
import { ProfileHeaderProps } from "../../../types";
import { Tooltip, Upload, message, Spin } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import { updateAvatar } from "../../../api/api-utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { updateUserPhoto } from "../../../store/userSlice";
import { useParams } from "react-router-dom";

interface UploadInfo {
  file: File;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  photo,
  name,
  details,
  photoAlt,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { id } = useParams();
  const [localPhoto, setLocalPhoto] = useState<string | null>(photo || null);
  const [messageApi, contextHolder] = message.useMessage();
  const [uploading, setUploading] = useState<boolean>(false);

  // Check if this is the user's own profile
  const isOwnProfile = () => {
    const { role, additionalInfo } = user.user;
    
    // Compare based on role
    switch (role.name) {
      case "Student":
        return additionalInfo.idStudent?.toString() === id;
      case "Teacher":
      case "Employee":
        return additionalInfo.idEmployee?.toString() === id;
      case "Parent":
        return additionalInfo.idParent?.toString() === id;
      default:
        return user.user.id.toString() === id;
    }
  };

  const canEditPhoto = isOwnProfile();

  const handleAvatarChange = async (info: UploadInfo) => {
    if (!canEditPhoto) return;
    
    const file = info.file;

    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string;
        setLocalPhoto(previewUrl);
      };
      reader.readAsDataURL(file);
      try {
        const updatedPhoto = await updateAvatar(user.accessToken, file);
        dispatch(updateUserPhoto(updatedPhoto.photo));

        messageApi.success(updatedPhoto.message);
      } catch (error) {
        console.error("Error updating avatar:", error);
        messageApi.error("Ошибка обновления аватара");
        setLocalPhoto(photo || null);
      } finally {
        setUploading(false);
      }
    }
  };

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <div className={styles.header}>
      {contextHolder}
      <div className={styles.header__photoContainer}>
        <div className={styles.header__photo}>
          {uploading ? (
            <div className={styles.header__photoLoading}>
              <Spin size="large" />
            </div>
          ) : localPhoto ? (
            <img src={localPhoto} alt={photoAlt} />
          ) : (
            <div className={styles.header__photoPlaceholder}>{initials}</div>
          )}
        </div>
        
        {canEditPhoto && (
          <Upload
            name="avatar"
            showUploadList={false}
            disabled={uploading}
            accept="image/*"
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                messageApi.error("Ты можешь загружать только изображения!");
                return false;
              }
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!isLt2M) {
                messageApi.error("Изображение должно быть меньше 2 МБ!");
                return false;
              }
              return true;
            }}
            customRequest={({ file, onSuccess }) => {
              handleAvatarChange({ file: file as File });
              if (onSuccess) {
                onSuccess({});
              }
            }}
          >
            <Tooltip
              title={uploading ? "Загрузка..." : "Изменить фото"}
              placement="bottom"
            >
              <div
                className={styles.header__photoOverlay}
                style={{ opacity: uploading ? 0.3 : undefined }}
              >
                <CameraOutlined className={styles.header__photoIcon} />
              </div>
            </Tooltip>
          </Upload>
        )}
      </div>

      <div className={styles.header__info}>
        <h2>{name}</h2>
        {details.map((detail, index) => (
          <p key={index}>{detail}</p>
        ))}
      </div>
    </div>
  );
};
