import { Select, Input, Button, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ApiAllSubjectsResponse, ApiEmployeeDetails, LessonFormValues, TimeSlot } from "../../../types";
import { TimeSlotSelector } from "../TimeSlotSelector/TimeSlotSelector";
import styles from "./LessonForm.module.scss";

const { Option } = Select;

interface LessonFormProps {
  loading: boolean;
  subjects: ApiAllSubjectsResponse["subjects"];
  employees: ApiEmployeeDetails[];
  standardTimeSlots: TimeSlot[];
  selectedTimeSlot: number;
  onTimeSlotChange: (index: number) => void;
  onAddLesson: (values: LessonFormValues) => void;
}

export const LessonForm = ({
  loading,
  subjects,
  employees,
  standardTimeSlots,
  selectedTimeSlot,
  onTimeSlotChange,
  onAddLesson,
}: LessonFormProps) => {
  // Get form instance from context
  const form = Form.useFormInstance();

  // Move the function inside the component
  const handleAddLesson = () => {
    const values = form.getFieldsValue();
    onAddLesson(values);
  };

  return (
    <div className={styles.lessonForm}>
      <h3 className={styles.lessonForm__title}>Шаг 2: Добавьте занятия</h3>

      <TimeSlotSelector
        timeSlots={standardTimeSlots}
        selectedSlot={selectedTimeSlot}
        onSelectSlot={onTimeSlotChange}
      />

      <div className={styles.lessonForm__fields}>
        <Form.Item
          name="subjectId"
          label="Предмет"
          rules={[{ required: true, message: "Выберите предмет" }]}
          className={styles.lessonForm__formItem}
        >
          <Select
            placeholder="Выберите предмет"
            loading={loading}
            className={styles.lessonForm__select}
          >
            {subjects.map((subject) => (
              <Option key={subject.idSubject} value={subject.idSubject}>
                {subject.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="employeeId"
          label="Преподаватель"
          rules={[{ required: true, message: "Выберите преподавателя" }]}
          className={styles.lessonForm__formItem}
        >
          <Select
            placeholder="Выберите преподавателя"
            loading={loading}
            className={styles.lessonForm__select}
          >
            {employees.map((employee) => (
              <Option key={employee.idEmployee} value={employee.idEmployee}>
                {employee.lastName} {employee.firstName.charAt(0)}.{" "}
                {employee.middleName && employee.middleName.charAt(0) + "."}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="roomNumber"
          label="Номер кабинета"
          rules={[{ required: true, message: "Введите номер кабинета" }]}
          className={styles.lessonForm__formItem}
        >
          <Input placeholder="Введите номер кабинета" />
        </Form.Item>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddLesson}
          className={styles.lessonForm__addButton}
        >
          Добавить занятие
        </Button>
      </div>
    </div>
  );
};
