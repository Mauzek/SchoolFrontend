import { DatePicker, Select, Form } from "antd";
import { Dayjs } from "dayjs";
import styles from "./DateClassSelector.module.scss";
import { ApiAllClassesResponse } from "../../../types";

const { Option } = Select;

interface DateClassSelectorProps {
  loading: boolean;
  classes: ApiAllClassesResponse["classes"];
  selectedDate: Dayjs | null;
  selectedClass: number | null;
  onDateChange: (date: Dayjs | null) => void;
  onClassChange: (classId: number) => void;
}

export const DateClassSelector = ({
  loading,
  classes,
  selectedDate,
  selectedClass,
  onDateChange,
  onClassChange,
}: DateClassSelectorProps) => {
  return (
    <div className={styles.dateClassSelector}>
      <h3 className={styles.dateClassSelector__title}>
        Шаг 1: Выберите дату и класс
      </h3>
      <div className={styles.dateClassSelector__fields}>
        <Form.Item
          name="date"
          label="Дата"
          rules={[{ required: true, message: "Выберите дату" }]}
          className={styles.dateClassSelector__formItem}
        >
          <DatePicker
            className={styles.dateClassSelector__datePicker}
            format="YYYY-MM-DD"
            placeholder="Выберите дату"
            onChange={onDateChange}
            value={selectedDate}
          />
        </Form.Item>

        <Form.Item
          name="classId"
          label="Класс"
          rules={[{ required: true, message: "Выберите класс" }]}
          className={styles.dateClassSelector__formItem}
        >
          <Select
            placeholder="Выберите класс"
            loading={loading}
            className={styles.dateClassSelector__select}
            onChange={onClassChange}
            value={selectedClass}
          >
            {classes.map((classItem) => (
              <Option key={classItem.idClass} value={classItem.idClass}>
                {classItem.classNumber}
                {classItem.classLetter}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </div>
  );
};
