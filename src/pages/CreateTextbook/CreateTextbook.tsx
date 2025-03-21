import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { message } from "antd";
import styles from "./CreateTextbook.module.scss";
import { createTextbook, getAllSubjects } from "../../api/api-utils";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface Subject {
  idSubject: number;
  name: string;
}

export const CreateTextbook: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramSubjectId } = useParams();
  const stateSubjectId = location.state?.idSubject;
  const user = useSelector((state: RootState) => state.user);

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // Используем ID предмета из параметров URL, state или устанавливаем пустую строку
  const initialSubjectId = paramSubjectId || stateSubjectId || "";

  // Form state
  const [formData, setFormData] = useState({
    idSubject: initialSubjectId.toString(),
    name: "",
    year: new Date().getFullYear().toString(),
    authors: "",
    isbn: "",
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await getAllSubjects(user.accessToken);
        setSubjects(response.subjects);
      } catch (err) {
        console.error("Ошибка при загрузке предметов:", err);
        setError("Не удалось загрузить список предметов");
        messageApi.error("Не удалось загрузить список предметов");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [user.accessToken, messageApi]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.idSubject ||
      !formData.name ||
      !formData.year ||
      !formData.authors ||
      !formData.isbn
    ) {
      setError("Пожалуйста, заполните все обязательные поля");
      messageApi.error("Пожалуйста, заполните все обязательные поля");
      return;
    }

    if (!file) {
      setError("Пожалуйста, загрузите файл учебника");
      messageApi.error("Пожалуйста, загрузите файл учебника");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const textbookFormData = new FormData();
      textbookFormData.append("idSubject", formData.idSubject);
      textbookFormData.append("name", formData.name);
      textbookFormData.append("year", formData.year);
      textbookFormData.append("authors", formData.authors);
      textbookFormData.append("isbn", formData.isbn);
      textbookFormData.append("textbookFile", file);

      await createTextbook(textbookFormData, user.accessToken);

      messageApi.success("Учебник успешно создан!");

      // Возвращаемся на страницу предмета или на страницу со списком учебников
      if (formData.idSubject) {
        navigate(`/subject/${formData.idSubject}`);
      } else {
        navigate("/textbooks");
      }
    } catch (err) {
      console.error("Ошибка при создании учебника:", err);
      setError("Не удалось создать учебник. Пожалуйста, попробуйте снова.");
      messageApi.error(
        "Не удалось создать учебник. Пожалуйста, попробуйте снова."
      );
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 30 },
    (_, i) => currentYear - 15 + i
  );

  return (
    <div className={styles.createTextbook}>
      {contextHolder}

      <div className={styles.createTextbook__header}>
        <div className={styles.createTextbook__headerIcon}>📚</div>
        <h1 className={styles.createTextbook__title}>
          Добавление нового учебника
        </h1>
        <p className={styles.createTextbook__subtitle}>
          Заполните форму ниже, чтобы добавить новый учебник в библиотеку
        </p>
      </div>

      {error && (
        <div className={styles.createTextbook__error}>
          <div className={styles.createTextbook__errorIcon}>⚠️</div>
          <p>{error}</p>
        </div>
      )}

      <form className={styles.createTextbook__form} onSubmit={handleSubmit}>
        <div className={styles.createTextbook__formSection}>
          <h2 className={styles.createTextbook__sectionTitle}>
            Основная информация
          </h2>

          <div className={styles.createTextbook__formGroup}>
            <label htmlFor="idSubject" className={styles.createTextbook__label}>
              Предмет <span className={styles.createTextbook__required}>*</span>
            </label>
            <div className={styles.createTextbook__inputWrapper}>
              <select
                id="idSubject"
                name="idSubject"
                value={formData.idSubject}
                onChange={handleInputChange}
                className={styles.createTextbook__select}
                required
              >
                <option value="">Выберите предмет</option>
                {subjects.map((subject) => (
                  <option key={subject.idSubject} value={subject.idSubject}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <div className={styles.createTextbook__inputIcon}>📚</div>
            </div>
          </div>

          <div className={styles.createTextbook__formGroup}>
            <label htmlFor="name" className={styles.createTextbook__label}>
              Название учебника{" "}
              <span className={styles.createTextbook__required}>*</span>
            </label>
            <div className={styles.createTextbook__inputWrapper}>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.createTextbook__input}
                placeholder="Введите название учебника"
                required
              />
              <div className={styles.createTextbook__inputIcon}>📖</div>
            </div>
          </div>

          <div className={styles.createTextbook__formGrid}>
            <div className={styles.createTextbook__formGroup}>
              <label htmlFor="year" className={styles.createTextbook__label}>
                Год издания{" "}
                <span className={styles.createTextbook__required}>*</span>
              </label>
              <div className={styles.createTextbook__inputWrapper}>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className={styles.createTextbook__select}
                  required
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <div className={styles.createTextbook__inputIcon}>📅</div>
              </div>
            </div>

            <div className={styles.createTextbook__formGroup}>
              <label htmlFor="isbn" className={styles.createTextbook__label}>
                ISBN <span className={styles.createTextbook__required}>*</span>
              </label>
              <div className={styles.createTextbook__inputWrapper}>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  className={styles.createTextbook__input}
                  placeholder="Например: 978-3-16-148410-0"
                  required
                />
                <div className={styles.createTextbook__inputIcon}>🔢</div>
              </div>
            </div>
          </div>

          <div className={styles.createTextbook__formGroup}>
            <label htmlFor="authors" className={styles.createTextbook__label}>
              Авторы <span className={styles.createTextbook__required}>*</span>
            </label>
            <div className={styles.createTextbook__inputWrapper}>
              <input
                type="text"
                id="authors"
                name="authors"
                value={formData.authors}
                onChange={handleInputChange}
                className={styles.createTextbook__input}
                placeholder="Укажите авторов учебника"
                required
              />
              <div className={styles.createTextbook__inputIcon}>👥</div>
            </div>
          </div>
        </div>

        <div className={styles.createTextbook__formSection}>
          <h2 className={styles.createTextbook__sectionTitle}>Файл учебника</h2>

          <div className={styles.createTextbook__formGroup}>
            <label htmlFor="file" className={styles.createTextbook__label}>
              Загрузить файл{" "}
              <span className={styles.createTextbook__required}>*</span>
            </label>
            <div className={styles.createTextbook__fileInputWrapper}>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className={styles.createTextbook__fileInput}
                accept=".pdf,.doc,.docx"
                required
              />
              <div className={styles.createTextbook__fileInputLabel}>
                <div className={styles.createTextbook__fileInputIcon}>📎</div>
                <span>Выберите файл или перетащите его сюда</span>
              </div>
            </div>
            {file && (
              <div className={styles.createTextbook__fileSelected}>
                <div className={styles.createTextbook__fileIcon}>📄</div>
                <div className={styles.createTextbook__fileInfo}>
                  <span className={styles.createTextbook__fileName}>
                    {file.name}
                  </span>
                  <span className={styles.createTextbook__fileSize}>
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              </div>
            )}
            <p className={styles.createTextbook__inputHint}>
              Поддерживаемые форматы: PDF, DOC, DOCX
            </p>
          </div>
        </div>

        <div className={styles.createTextbook__actions}>
          <button
            type="button"
            className={styles.createTextbook__cancelButton}
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Отмена
          </button>
          <button
            type="submit"
            className={styles.createTextbook__submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.createTextbook__buttonSpinner}></span>
                <span>Создание...</span>
              </>
            ) : (
              "Создать учебник"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
