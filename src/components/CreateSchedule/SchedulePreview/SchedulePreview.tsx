import { Button } from "antd";
import { Dayjs } from "dayjs";
import { CreateScheduleItem } from "../../../types";
import { ScheduleItemComponent } from "../ScheduleItem/ScheduleItem";
import styles from "./SchedulePreview.module.scss";

interface SchedulePreviewProps {
  scheduleItems: CreateScheduleItem[];
  selectedDate: Dayjs;
  className: string;
  onRemoveItem: (index: number) => void;
  onSubmit: () => void;
  onReset: () => void;
  loading: boolean;
}

export const SchedulePreview = ({
  scheduleItems,
  selectedDate,
  className,
  onRemoveItem,
  onSubmit,
  onReset,
  loading,
}: SchedulePreviewProps) => {
  return (
    <div className={styles.schedulePreview}>
      <div className={styles.schedulePreview__header}>
        <h4>Предварительный просмотр</h4>
        <div>
          Дата: {selectedDate.format("DD.MM.YYYY")} | Класс: {className}
        </div>
      </div>

      {scheduleItems.length > 0 ? (
        <div className={styles.schedulePreview__items}>
          {scheduleItems.map((item, index) => (
            <ScheduleItemComponent
              key={index}
              item={item}
              onRemove={() => onRemoveItem(index)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.schedulePreview__emptyState}>
          Добавьте занятия, чтобы увидеть их здесь
        </div>
      )}

      {scheduleItems.length > 0 && (
        <div className={styles.schedulePreview__actions}>
          <Button
            type="primary"
            onClick={onSubmit}
            loading={loading}
            className={styles.schedulePreview__submitButton}
          >
            Создать расписание
          </Button>

          <Button
            onClick={onReset}
            className={styles.schedulePreview__resetButton}
          >
            Сбросить всё
          </Button>
        </div>
      )}
    </div>
  );
};
