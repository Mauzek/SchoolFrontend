import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "./CreateAssignment.module.scss";
import {
  createAssignment,
  getAllSubjects,
  getAllClasses,
} from "../../api/api-utils";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ApiClassResponse } from "../../types";

interface Subject {
  idSubject: number;
  name: string;
}

export const CreateAssignment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idClass = searchParams.get('classId');
  const idSubject = useParams().id;
  console.log(idSubject)
  console.log(idClass)
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ApiClassResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    idSubject: idSubject ? idSubject.toString() : "",
    idClass: idClass ? idClass.toString() : "",
    title: "",
    description: "",
    openTime: "",
    closeTime: "",
    isTesting: false,
    attemptsCount: "1",
  });

  const [file, setFile] = useState<File | null>(null);
  const [testingFile, setTestingFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch subjects and classes
        const subjectsResponse = await getAllSubjects(user.accessToken);
        setSubjects(subjectsResponse.subjects);

        const classesResponse = await getAllClasses(user.accessToken);
        setClasses(classesResponse.classes);

        // Set default dates
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        setFormData((prev) => ({
          ...prev,
          openTime: formatDateForInput(today),
          closeTime: formatDateForInput(nextWeek),
          // Сохраняем переданные через location.state значения
          idSubject: idSubject ? idSubject.toString() : prev.idSubject,
          idClass: idClass ? idClass.toString() : prev.idClass,
        }));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.accessToken, idClass, idSubject]);

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    isTestingFile: boolean = false
  ) => {
    if (e.target.files && e.target.files[0]) {
      if (isTestingFile) {
        setTestingFile(e.target.files[0]);
      } else {
        setFile(e.target.files[0]);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Проверяем, не отправляется ли уже форма
    if (isSubmitting) {
      console.log("Форма уже отправляется, игнорируем повторный запрос");
      return;
    }

    if (
      !formData.idSubject ||
      !formData.idClass ||
      !formData.title ||
      !formData.description ||
      !formData.openTime ||
      !formData.closeTime
    ) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }

    // Для тестовых заданий проверяем наличие файла с тестом
    if (formData.isTesting && !testingFile) {
      setError("Для тестового задания необходимо загрузить файл с тестом");
      return;
    }

    try {
      setLoading(true);
      setIsSubmitting(true);
      setError(null);

      // Format dates properly
      const openDate = new Date(formData.openTime);
      const closeDate = new Date(formData.closeTime);

      if (closeDate <= openDate) {
        setError("Дата закрытия должна быть позже даты открытия");
        setLoading(false);
        setIsSubmitting(false);
        return;
      }

      // Create FormData for assignment
      const assignmentFormData = new FormData();

      // Add basic assignment data
      assignmentFormData.append("idSubject", formData.idSubject);
      assignmentFormData.append("idClass", formData.idClass);
      assignmentFormData.append(
        "idEmployee",
        user.user.additionalInfo.idEmployee?.toString() || "0"
      );
      assignmentFormData.append("title", formData.title);
      assignmentFormData.append("description", formData.description);
      assignmentFormData.append("openTime", formData.openTime);
      assignmentFormData.append("closeTime", formData.closeTime);
      assignmentFormData.append("isTesting", formData.isTesting.toString());

      // Add assignment file if exists
      if (file) {
        assignmentFormData.append("assignmentFile", file);
      }

      // Если это тестовое задание, добавляем соответствующие поля
      if (formData.isTesting) {
        assignmentFormData.append("attemptsCount", formData.attemptsCount);

        // Add testing file if exists
        if (testingFile) {
          assignmentFormData.append("testingFile", testingFile);
        }
      }

      // Отправляем один запрос с полной FormData
      await createAssignment(assignmentFormData, user.accessToken);

      navigate(-1);
    } catch (err) {
      console.error("Ошибка при создании задания:", err);
      setError("Не удалось создать задание. Пожалуйста, попробуйте позже.");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.createAssignment}>
      <div className={styles.createAssignment__header}>
        <div className={styles.createAssignment__headerIcon}>📝</div>
        <h1 className={styles.createAssignment__title}>
          Создание нового задания
        </h1>
        <p className={styles.createAssignment__subtitle}>
          Заполните форму ниже для создания нового задания для студентов
        </p>
      </div>

      {error && (
        <div className={styles.createAssignment__error}>
          <div className={styles.createAssignment__errorIcon}>⚠️</div>
          <p>{error}</p>
        </div>
      )}

      <form className={styles.createAssignment__form} onSubmit={handleSubmit}>
        <div className={styles.createAssignment__formSection}>
          <h2 className={styles.createAssignment__sectionTitle}>
            Основная информация
          </h2>

          <div className={styles.createAssignment__formGrid}>
            <div className={styles.createAssignment__formGroup}>
              <label
                htmlFor="idSubject"
                className={styles.createAssignment__label}
              >
                Предмет{" "}
                <span className={styles.createAssignment__required}>*</span>
              </label>
              <div className={styles.createAssignment__inputWrapper}>
                <select
                  id="idSubject"
                  name="idSubject"
                  value={formData.idSubject}
                  onChange={handleInputChange}
                  className={styles.createAssignment__select}
                  required
                >
                  <option value="">Выберите предмет</option>
                  {subjects.map((subject) => (
                    <option key={subject.idSubject} value={subject.idSubject}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                <div className={styles.createAssignment__inputIcon}>📚</div>
              </div>
            </div>

            <div className={styles.createAssignment__formGroup}>
              <label
                htmlFor="idClass"
                className={styles.createAssignment__label}
              >
                Класс{" "}
                <span className={styles.createAssignment__required}>*</span>
              </label>
              <div className={styles.createAssignment__inputWrapper}>
                <select
                  id="idClass"
                  name="idClass"
                  value={formData.idClass}
                  onChange={handleInputChange}
                  className={styles.createAssignment__select}
                  required
                >
                  <option value="">Выберите класс</option>
                  {classes.map((cls) => (
                    <option key={cls.idClass} value={cls.idClass}>
                      {cls.classNumber} {cls.classLetter}
                    </option>
                  ))}
                </select>
                <div className={styles.createAssignment__inputIcon}>👨‍👩‍👧‍👦</div>
              </div>
            </div>
          </div>

          <div className={styles.createAssignment__formGroup}>
            <label htmlFor="title" className={styles.createAssignment__label}>
              Название задания{" "}
              <span className={styles.createAssignment__required}>*</span>
            </label>
            <div className={styles.createAssignment__inputWrapper}>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={styles.createAssignment__input}
                placeholder="Введите название задания"
                required
              />
              <div className={styles.createAssignment__inputIcon}>✏️</div>
            </div>
          </div>

          <div className={styles.createAssignment__formGroup}>
            <label
              htmlFor="description"
              className={styles.createAssignment__label}
            >
              Описание задания{" "}
              <span className={styles.createAssignment__required}>*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.createAssignment__textarea}
              placeholder="Введите подробное описание задания"
              rows={5}
              required
            />
          </div>
        </div>

        <div className={styles.createAssignment__formSection}>
          <h2 className={styles.createAssignment__sectionTitle}>
            Сроки выполнения
          </h2>

          <div className={styles.createAssignment__formGrid}>
            <div className={styles.createAssignment__formGroup}>
              <label
                htmlFor="openTime"
                className={styles.createAssignment__label}
              >
                Дата открытия{" "}
                <span className={styles.createAssignment__required}>*</span>
              </label>
              <div className={styles.createAssignment__inputWrapper}>
                <input
                  type="date"
                  id="openTime"
                  name="openTime"
                  value={formData.openTime}
                  onChange={handleInputChange}
                  className={styles.createAssignment__input}
                  required
                />
                <div className={styles.createAssignment__inputIcon}>📅</div>
              </div>
              <p className={styles.createAssignment__inputHint}>
                Дата, когда задание станет доступно студентам
              </p>
            </div>

            <div className={styles.createAssignment__formGroup}>
              <label
                htmlFor="closeTime"
                className={styles.createAssignment__label}
              >
                Дата закрытия{" "}
                <span className={styles.createAssignment__required}>*</span>
              </label>
              <div className={styles.createAssignment__inputWrapper}>
                <input
                  type="date"
                  id="closeTime"
                  name="closeTime"
                  value={formData.closeTime}
                  onChange={handleInputChange}
                  className={styles.createAssignment__input}
                  required
                />
                <div className={styles.createAssignment__inputIcon}>🔒</div>
              </div>
              <p className={styles.createAssignment__inputHint}>
                Дата, после которой задание будет закрыто для сдачи
              </p>
            </div>
          </div>
        </div>

        <div className={styles.createAssignment__formSection}>
          <h2 className={styles.createAssignment__sectionTitle}>
            Материалы и тип задания
          </h2>

          <div className={styles.createAssignment__formGroup}>
            <label htmlFor="file" className={styles.createAssignment__label}>
              Материалы задания
            </label>
            <div className={styles.createAssignment__fileInputWrapper}>
              <input
                type="file"
                id="file"
                onChange={(e) => handleFileChange(e)}
                className={styles.createAssignment__fileInput}
              />
              <div className={styles.createAssignment__fileInputLabel}>
                <div className={styles.createAssignment__fileInputIcon}>📎</div>
                <span>Выберите файл или перетащите его сюда</span>
              </div>
            </div>
            {file && (
              <div className={styles.createAssignment__fileSelected}>
                <div className={styles.createAssignment__fileIcon}>📄</div>
                <div className={styles.createAssignment__fileInfo}>
                  <span className={styles.createAssignment__fileName}>
                    {file.name}
                  </span>
                  <span className={styles.createAssignment__fileSize}>
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.createAssignment__formGroup}>
            <div className={styles.createAssignment__checkboxContainer}>
              <input
                type="checkbox"
                id="isTesting"
                name="isTesting"
                checked={formData.isTesting}
                onChange={handleCheckboxChange}
                className={styles.createAssignment__checkbox}
              />
              <label
                htmlFor="isTesting"
                className={styles.createAssignment__checkboxLabel}
              >
                Это тестовое задание
              </label>
            </div>
          </div>

          {formData.isTesting && (
            <div className={styles.createAssignment__testingSection}>
              <h3 className={styles.createAssignment__sectionTitle}>
                Настройки тестирования
              </h3>

              <div className={styles.createAssignment__formGroup}>
                <label
                  htmlFor="attemptsCount"
                  className={styles.createAssignment__label}
                >
                  Количество попыток
                </label>
                <div className={styles.createAssignment__inputWrapper}>
                  <input
                    type="number"
                    id="attemptsCount"
                    name="attemptsCount"
                    value={formData.attemptsCount}
                    onChange={handleInputChange}
                    className={styles.createAssignment__input}
                    min="1"
                    max="10"
                  />
                  <div className={styles.createAssignment__inputIcon}>🔄</div>
                </div>
              </div>

              <div className={styles.createAssignment__formGroup}>
                <label
                  htmlFor="testingFile"
                  className={styles.createAssignment__label}
                >
                  Файл с тестом{" "}
                  <span className={styles.createAssignment__required}>*</span>
                </label>
                <div className={styles.createAssignment__fileInputWrapper}>
                  <input
                    type="file"
                    id="testingFile"
                    onChange={(e) => handleFileChange(e, true)}
                    className={styles.createAssignment__fileInput}
                    required={formData.isTesting}
                  />
                  <div className={styles.createAssignment__fileInputLabel}>
                    <div className={styles.createAssignment__fileInputIcon}>
                      📝
                    </div>
                    <span>Выберите файл с тестом</span>
                  </div>
                </div>
                {testingFile && (
                  <div className={styles.createAssignment__fileSelected}>
                    <div className={styles.createAssignment__fileIcon}>📄</div>
                    <div className={styles.createAssignment__fileInfo}>
                      <span className={styles.createAssignment__fileName}>
                        {testingFile.name}
                      </span>
                      <span className={styles.createAssignment__fileSize}>
                        {(testingFile.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.createAssignment__actions}>
          <button
            type="button"
            className={styles.createAssignment__cancelButton}
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Отмена
          </button>
          <button
            type="submit"
            className={styles.createAssignment__submitButton}
            disabled={loading || isSubmitting}
          >
            {loading ? (
              <>
                <span className={styles.createAssignment__buttonSpinner}></span>
                <span>Создание...</span>
              </>
            ) : (
              "Создать задание"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
