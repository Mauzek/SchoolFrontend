import { SearchOutlined } from "@ant-design/icons"; // Оставляем только иконку
import styles from "./SubjectsMainHeader.module.scss";

interface SubjectsHeaderProps {
  searchValue: string;
  onSearch: (value: string) => void;
}

export const SubjectsMainHeader = ({
  searchValue,
  onSearch,
}: SubjectsHeaderProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleClear = () => {
    onSearch("");
  };

  return (
    <div className={styles.subjectsHeader}>
      <h1 className={styles.subjectsHeader__title}>Учебные предметы</h1>
      <p className={styles.subjectsHeader__subtitle}>
        Полный список предметов, доступных в нашей школе
      </p>

      <div className={styles.subjectsHeader__searchContainer}>
        <div className={styles.subjectsHeader__searchWrapper}>
          <SearchOutlined className={styles.subjectsHeader__searchIcon} />
          <input
            type="text"
            className={styles.subjectsHeader__searchInput}
            placeholder="Поиск предметов"
            value={searchValue}
            onChange={handleInputChange}
          />
          {searchValue && (
            <button
              className={styles.subjectsHeader__clearButton}
              onClick={handleClear}
              aria-label="Очистить поиск"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
