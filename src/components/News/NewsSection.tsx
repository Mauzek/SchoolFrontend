import React, { useState, useEffect } from "react";
import styles from "./NewsSection.module.scss";
import { NewsItem } from "../../types/components";

// Временные данные для демонстрации
const demoNews: NewsItem[] = [
  {
    id: 1,
    title: "Школьная олимпиада по математике",
    content:
      "В следующую пятницу состоится школьная олимпиада по математике. Приглашаем всех учеников принять участие!",
    date: "2023-10-15",
    image:
      "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    category: "События",
  },
  {
    id: 2,
    title: "Родительское собрание",
    content:
      "Уважаемые родители! Приглашаем вас на родительское собрание, которое состоится в четверг в 18:00.",
    date: "2023-10-12",
    image:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    category: "Объявления",
  },
  {
    id: 3,
    title: "Новые книги в библиотеке",
    content:
      "Наша школьная библиотека пополнилась новыми учебниками и художественной литературой. Приглашаем всех посетить!",
    date: "2023-10-10",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    category: "Новости",
  },
  {
    id: 4,
    title: "Спортивные соревнования",
    content:
      "В эту субботу состоятся межшкольные соревнования по волейболу. Приходите поддержать нашу команду!",
    date: "2023-10-08",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    category: "События",
  },
  {
    id: 5,
    title: "Открытие нового компьютерного класса",
    content:
      "Рады сообщить об открытии нового компьютерного класса с современным оборудованием. Теперь уроки информатики станут еще интереснее!",
    date: "2024-05-20",
    image:
      "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    category: "Новости",
  },
  {
    id: 6,
    title: "Экскурсия в исторический музей",
    content:
      "Для учеников 7-8 классов организуется экскурсия в исторический музей 25 мая. Запись у классных руководителей до 22 мая.",
    date: "2024-05-18",
    image:
      "https://images.unsplash.com/photo-1692469173587-64f804a3670c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "События",
  },
  {
    id: 7,
    title: "Итоговое собрание перед летними каникулами",
    content:
      "Уважаемые родители! Приглашаем вас на итоговое собрание перед летними каникулами, которое состоится 30 мая в 18:30 в актовом зале.",
    date: "2024-05-15",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    category: "Объявления",
  },
  {
    id: 8,
    title: "Летний школьный лагерь",
    content:
      "Открыта запись в летний школьный лагерь. Программа включает спортивные мероприятия, творческие мастер-классы и экскурсии. Количество мест ограничено!",
    date: "2024-05-12",
    image:
      "https://images.unsplash.com/photo-1596496181871-9681eacf9764?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    category: "Объявления",
  },
  {
    id: 9,
    title: "Победа в городской олимпиаде по физике",
    content:
      "Поздравляем Алексея Смирнова, ученика 10А класса, занявшего первое место в городской олимпиаде по физике! Гордимся нашими талантами!",
    date: "2024-05-10",
    image:
      "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    category: "Достижения",
  },
  {
    id: 10,
    title: "Обновление школьной библиотеки",
    content:
      "В школьной библиотеке появились новые учебные пособия по английскому языку и художественная литература. Приглашаем посетить и выбрать книги для летнего чтения.",
    date: "2024-05-08",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    category: "Новости",
  },
  {
    id: 11,
    title: "Школьный театральный фестиваль",
    content:
      "С 1 по 5 июня пройдет ежегодный школьный театральный фестиваль. В программе постановки по произведениям русской и зарубежной классики.",
    date: "2024-05-05",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    category: "События",
  },
  {
    id: 12,
    title: "Изменения в расписании на последнюю неделю мая",
    content:
      "В связи с проведением итоговых контрольных работ, в расписании занятий на последнюю неделю мая произошли изменения. Обновленное расписание доступно в электронном дневнике.",
    date: "2024-05-03",
    image:
      "https://images.unsplash.com/photo-1506784365847-bbad939e9335?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    category: "Объявления",
  },
  {
    id: 13,
    title: "Встреча с известным писателем",
    content:
      "27 мая в нашей школе состоится встреча с известным детским писателем Марией Петровой. Автор проведет мастер-класс по творческому письму для учеников 5-7 классов.",
    date: "2024-05-01",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    category: "События",
  },
  {
    id: 14,
    title: "Результаты школьной спартакиады",
    content:
      "Подведены итоги школьной спартакиады. Первое место в общекомандном зачете занял 9Б класс. Поздравляем победителей и благодарим всех участников за спортивный дух!",
    date: "2024-04-28",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    category: "Достижения",
  }
];

// Форматирование даты
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("ru-RU", options);
};

export const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Все");

  // Получение новостей (в реальном приложении здесь будет API запрос)
  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setNews(demoNews);
    }, 100);
  }, []);

  // Получение уникальных категорий
  const categories = [
    "Все",
    ...Array.from(new Set(demoNews.map((item) => item.category))),
  ];

  // Фильтрация новостей по категории
  const filteredNews =
    activeCategory === "Все"
      ? news
      : news.filter((item) => item.category === activeCategory);

  return (
    <section className={styles["news"]}>
      <header className={styles["news__header"]}>
        <h2 className={styles["news__title"]}>Школьные новости</h2>
        <nav className={styles["news__filter"]}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles["news__filter-button"]} ${
                activeCategory === category ? styles["news__filter-button--active"] : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </nav>
      </header>

      <section className={styles["news__grid"]}>
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <article key={item.id} className={styles["news__card"]}>
              {item.image && (
                <figure className={styles["news__image-wrapper"]}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles["news__image"]}
                  />
                  <figcaption className={styles["news__category-tag"]}>{item.category}</figcaption>
                </figure>
              )}
              <div className={styles["news__content"]}>
                <h3 className={styles["news__item-title"]}>{item.title}</h3>
                <p className={styles["news__item-date"]}>{formatDate(item.date)}</p>
                <p className={styles["news__item-text"]}>{item.content}</p>
                <a href="/" className={styles["news__read-more"]}>Читать далее</a>
              </div>
            </article>
          ))
        ) : (
          <div className={styles["news__empty"]}>
            <p>Загрузка новостей...</p>
          </div>
        )}
      </section>
    </section>
  );
};

