import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Welcome.module.scss";
import { images } from "../../assets/images/welcomePage/index";
import { ShinyText } from "../../components/ShinyText/ShinyText";

export const Welcome: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    middleName: "",
    reason: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement email sending logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className={styles.welcome}>
      <header className={styles["welcome__header"]}>
        <div className={styles["welcome__logo-container"]}>
          <img
            src={images[5]}
            alt="Logo"
            className={styles["welcome__logo-container-img"]}
          />
          <ShinyText text="International School" speed={7} />
        </div>
        <nav className={styles["welcome__nav"]}>
          <ul className={styles["welcome__nav-list"]}>
            <li className={styles["welcome__nav-item"]}>
              <a href="#about" className={styles["welcome__nav-link"]}>
                О школе
              </a>
            </li>
            <li className={styles["welcome__nav-item"]}>
              <a href="#admission" className={styles["welcome__nav-link"]}>
                Поступление
              </a>
            </li>
            <li className={styles["welcome__nav-item"]}>
              <a href="#contact" className={styles["welcome__nav-link"]}>
                Контакты
              </a>
            </li>
            <li className={styles["welcome__nav-item"]}>
              <Link to="/auth" className={styles["welcome__login-button"]}>
                Вход
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className={styles["welcome__content"]}>
        <section className={styles["welcome__banner"]}>
          <div className={styles["welcome__banner-text"]}>
            <h1 id="about">Добро пожаловать в нашу школу</h1>
            <p>
              Наша школа стремится предоставить лучшее образование для наших
              учеников. Мы предлагаем широкий спектр программ и мероприятий,
              чтобы помочь ученикам расти и добиваться успеха.
            </p>
          </div>
        </section>
        <section className={styles["welcome__section"]}>
          <div className={styles["welcome__poster"]}>
            <img
              src={images[1]}
              alt="School Poster"
              className={styles["welcome__poster-image"]}
            />
            <div className={styles["welcome__poster-text"]}>
              <h2>О школе</h2>
              <p>
                Наша школа стремится предоставить лучшее образование для наших
                учеников. Мы предлагаем широкий спектр программ и мероприятий,
                чтобы помочь ученикам расти и добиваться успеха.
              </p>
              <ul className={styles["welcome__list"]}>
                <li>Международная аккредитация</li>
                <li>Опытные преподаватели</li>
                <li>Современные образовательные технологии</li>
                <span id="admission" />
                <li>Индивидуальный подход к каждому ученику</li>
                <li>Подготовка к университетам по всему миру</li>
              </ul>
            </div>
          </div>
        </section>
        <section className={styles["welcome__section"]}>
          <div className={styles["welcome__info"]}>
            <div className={styles["welcome__info-text"]}>
              <h2>Поступление</h2>
              <p>
                Узнайте о процессе поступления и как подать заявку в нашу школу.
                Мы приветствуем учеников из всех слоев общества и стремимся
                создать инклюзивную среду.
              </p>
              <h3>Этапы поступления:</h3>
              <ol className={styles["welcome__list"]}>
                <li>Заполнение заявки онлайн</li>
                <li>Собеседование с представителем школы</li>
                <li>Тестирование знаний (по необходимости)</li>
                <li>Ознакомительная экскурсия</li>
                <li>Заключение договора</li>
              </ol>
            </div>
            <img
              src={images[3]}
              alt="Admission"
              className={styles["welcome__info-image"]}
            />
          </div>
        </section>
        <section id="contact" className={styles["welcome__section"]}>
          <div className={styles["welcome__contact-container"]}>
            <div className={styles["welcome__contact-info"]}>
              <h2>Свяжитесь с нами</h2>
              <p>
                Мы всегда рады помочь вам с любыми вопросами. Оставьте свою
                заявку, и мы свяжемся с вами в ближайшее время.
              </p>
              <ul className={styles["welcome__contact-details"]}>
                <li>
                  <span>📍</span> 123 School Street, City, Country
                </li>
                <li>
                  <span>📞</span> +1 (123) 456-7890
                </li>
                <li>
                  <span>✉️</span> info@schoolname.edu
                </li>
                <li>
                  <span>🕒</span> Monday-Friday: 8:00 AM - 5:00 PM
                </li>
              </ul>
            </div>
            <div className={styles["welcome__contact-form"]}>
              <form onSubmit={handleSubmit} className={styles["welcome__form"]}>
                <label
                  htmlFor="email"
                  className={styles["welcome__form-label"]}
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles["welcome__form-input"]}
                />

                <label
                  htmlFor="firstName"
                  className={styles["welcome__form-label"]}
                >
                  Имя:
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={styles["welcome__form-input"]}
                />

                <label
                  htmlFor="lastName"
                  className={styles["welcome__form-label"]}
                >
                  Фамилия:
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={styles["welcome__form-input"]}
                />

                <label
                  htmlFor="middleName"
                  className={styles["welcome__form-label"]}
                >
                  Отчество:
                </label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  required
                  className={styles["welcome__form-input"]}
                />

                <label
                  htmlFor="reason"
                  className={styles["welcome__form-label"]}
                >
                  Причина поступления:
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className={styles["welcome__form-textarea"]}
                />

                <button
                  type="submit"
                  className={styles["welcome__form-button"]}
                >
                  Отправить заявку
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className={styles["welcome__footer"]}>
        <nav className={styles["welcome__footer-nav"]}>
          <a href="#about" className={styles["welcome__footer-link"]}>
            О школе
          </a>
          <a href="#admission" className={styles["welcome__footer-link"]}>
            Поступление
          </a>
          <a href="#contact" className={styles["welcome__footer-link"]}>
            Контакты
          </a>
        </nav>
        <p>&copy; 2025 School Name. Все права защищены.</p>
      </footer>
    </div>
  );
};
