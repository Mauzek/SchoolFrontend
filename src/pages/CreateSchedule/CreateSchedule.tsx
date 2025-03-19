import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Form, message, ConfigProvider } from "antd";
import styles from "./CreateSchedule.module.scss";
import { RootState } from "../../store";
import {
  getAllClasses,
  getAllSubjects,
  getAllEmployees,
  createScheduleItem,
} from "../../api/api-utils";
import {
  ApiCreateSchedule,
  ApiAllClassesResponse,
  ApiAllSubjectsResponse,
  ApiEmployeeDetails,
  CreateScheduleItem as ScheduleItem,
  TimeSlot,
  LessonFormValues,
} from "../../types";
import type { Dayjs } from "dayjs";
import {
  DateClassSelector,
  LessonForm,
  SchedulePreview,
} from "../../components";

const theme = {
  token: {
    colorPrimary: "var(--color-primary)",
    colorPrimaryHover: "var(--color-primary-dark)",
    colorPrimaryActive: "var(--color-primary-dark)",
    colorBgContainer: "white",
    colorBorder: "var(--color-border)",
    borderRadius: 6,
  },
  components: {
    Select: {
      optionSelectedBg: "rgb(76, 175, 80)",
      optionSelectedColor: "rgb(255, 255, 255)",
      optionActiveBg: "rgba(24, 144, 255, 0.05)",
    },
    Button: {
      colorPrimary: "var(--color-primary)",
      colorPrimaryHover: "var(--color-primary-dark)",
      colorPrimaryActive: "var(--color-primary-dark)",
      colorPrimaryText: "white",
    },
  },
};

export const CreateSchedule = () => {
  const [form] = Form.useForm<LessonFormValues>();
  const user = useSelector((state: RootState) => state.user);

  const [classes, setClasses] = useState<ApiAllClassesResponse["classes"]>([]);
  const [subjects, setSubjects] = useState<ApiAllSubjectsResponse["subjects"]>(
    []
  );
  const [employees, setEmployees] = useState<ApiEmployeeDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number>(0);

  const standardTimeSlots: TimeSlot[] = [
    { startTime: "08:00:00", endTime: "09:30:00" },
    { startTime: "09:45:00", endTime: "11:15:00" },
    { startTime: "11:30:00", endTime: "13:00:00" },
    { startTime: "13:30:00", endTime: "15:00:00" },
    { startTime: "15:15:00", endTime: "16:45:00" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const classesResponse = await getAllClasses(user.accessToken);
        if (classesResponse && classesResponse.classes) {
          setClasses(classesResponse.classes);
        }

        const subjectsResponse = await getAllSubjects(user.accessToken);
        if (subjectsResponse && subjectsResponse.subjects) {
          setSubjects(subjectsResponse.subjects);
        }

        const employeesResponse = await getAllEmployees(user.accessToken);
        if (employeesResponse) {
          setEmployees(employeesResponse);
        }

        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        message.error("Не удалось загрузить необходимые данные");
        setLoading(false);
      }
    };

    fetchData();
  }, [user.accessToken]);

  const getWeekDay = (date: string): string => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = new Date(date).getDay();
    return days[dayIndex];
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    form.setFieldsValue({ date }); // Используем as any только здесь, так как date не входит в LessonFormValues
  };

  const handleClassChange = (classId: number) => {
    setSelectedClass(classId);
    form.setFieldsValue({ classId }); // Используем as any только здесь, так как classId не входит в LessonFormValues
  };

  const handleTimeSlotChange = (index: number) => {
    setSelectedTimeSlot(index);
  };

  const addScheduleItem = (values: LessonFormValues) => {
    if (
      !selectedDate ||
      !selectedClass ||
      !values.subjectId ||
      !values.employeeId ||
      !values.roomNumber
    ) {
      message.error("Пожалуйста, заполните все поля");
      return;
    }

    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const weekDay = getWeekDay(formattedDate);
    const timeSlot = standardTimeSlots[selectedTimeSlot];

    const subject = subjects.find((s) => s.idSubject === values.subjectId);
    const employee = employees.find((e) => e.idEmployee === values.employeeId);

    const newItem: ScheduleItem = {
      idClass: selectedClass,
      idSubject: values.subjectId,
      idEmployee: values.employeeId,
      date: formattedDate,
      weekDay,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
      roomNumber: values.roomNumber,
      subjectName: subject?.name,
      teacherName: employee
        ? `${employee.lastName} ${employee.firstName.charAt(0)}. ${
            employee.middleName ? employee.middleName.charAt(0) + "." : ""
          }`
        : "",
    };

    setScheduleItems([...scheduleItems, newItem]);

    // Очистить поля предмета, преподавателя и аудитории, но оставить дату и класс
    form.setFieldsValue({
      subjectId: undefined,
      employeeId: undefined,
      roomNumber: "",
    });

    // Переход к следующему временному слоту
    const nextSlot = (selectedTimeSlot + 1) % standardTimeSlots.length;
    setSelectedTimeSlot(nextSlot);
  };

  // Функция для удаления занятия
  const removeScheduleItem = (index: number) => {
    const newItems = [...scheduleItems];
    newItems.splice(index, 1);
    setScheduleItems(newItems);
  };

  // Обработчик отправки формы
  const handleSubmit = async () => {
    if (scheduleItems.length === 0) {
      message.error("Добавьте хотя бы одно занятие");
      return;
    }

    try {
      setLoading(true);

      // Создаем массив промисов для каждого занятия
      const createPromises = scheduleItems.map((item) => {
        const scheduleData: ApiCreateSchedule = {
          idClass: item.idClass,
          idSubject: item.idSubject,
          idEmployee: item.idEmployee,
          date: item.date,
          weekDay: item.weekDay,
          startTime: item.startTime,
          endTime: item.endTime,
          roomNumber: item.roomNumber,
        };

        return createScheduleItem(scheduleData, user.accessToken);
      });

      // Ждем выполнения всех промисов
      await Promise.all(createPromises);

      message.success("Расписание успешно создано");
      form.resetFields();
      setScheduleItems([]);
      setSelectedDate(null);
      setSelectedClass(null);
      setSelectedTimeSlot(0);

      setLoading(false);
    } catch (error) {
      console.error("Ошибка при создании расписания:", error);
      message.error("Не удалось создать расписание");
      setLoading(false);
    }
  };

  // Получить название класса по ID
  const getClassName = (classId: number) => {
    const classItem = classes.find((c) => c.idClass === classId);
    return classItem ? `${classItem.classNumber}${classItem.classLetter}` : "";
  };

  const resetForm = () => {
    form.resetFields();
    setScheduleItems([]);
    setSelectedDate(null);
    setSelectedClass(null);
    setSelectedTimeSlot(0);
  };

  return (
    <ConfigProvider theme={theme}>
      <div className={styles.createSchedule}>
        <h1 className={styles.createSchedule__title}>Создание расписания</h1>

        <Form
          form={form}
          layout="vertical"
          className={styles.createSchedule__form}
        >
          <DateClassSelector
            loading={loading}
            classes={classes}
            selectedDate={selectedDate}
            selectedClass={selectedClass}
            onDateChange={handleDateChange}
            onClassChange={handleClassChange}
          />

          {selectedDate && selectedClass && (
            <>
              <LessonForm
                loading={loading}
                subjects={subjects}
                employees={employees}
                standardTimeSlots={standardTimeSlots}
                selectedTimeSlot={selectedTimeSlot}
                onTimeSlotChange={handleTimeSlotChange}
                onAddLesson={addScheduleItem}
              />

              <SchedulePreview
                scheduleItems={scheduleItems}
                selectedDate={selectedDate}
                className={getClassName(selectedClass)}
                onRemoveItem={removeScheduleItem}
                onSubmit={handleSubmit}
                onReset={resetForm}
                loading={loading}
              />
            </>
          )}
        </Form>
      </div>
    </ConfigProvider>
  );
};
