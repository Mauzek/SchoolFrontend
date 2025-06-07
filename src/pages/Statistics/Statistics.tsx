import { useEffect, useState } from "react";
import {
  Tabs,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Typography,
  Spin,
  Empty,
  Select,
  Table,
  Radio,
  Avatar,
  Alert,
  Space,
} from "antd";
import {
  BarChartOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./Statistics.module.scss";
import {
  getAvgGradesByClass,
  getAvgGradesByStudent,
  getAvgGradesBySubject,
  getGradeDistributionByClass,
  getGradeDistributionByStudent,
  getGradeDistributionBySubject,
} from "../../api/api-utils";

const { Title, Text } = Typography;
const { Option } = Select;

interface GradeDistribution {
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

interface ClassAvgGrade {
  idClass: number;
  classNumber: number;
  classLetter: string;
  averageGrade: number;
  studentCount: number;
  classTeacher?: {
    idEmployee: number;
    firstName: string;
    lastName: string;
  };
}

interface StudentAvgGrade {
  idStudent: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  averageGrade: number;
  class: {
    classNumber: number;
    classLetter: string;
  };
  classTeacher?: {
    idEmployee: number;
    firstName: string;
    lastName: string;
  };
}

interface SubjectAvgGrade {
  idSubject: number;
  subjectName: string;
  averageGrade: number;
}

interface ClassDistribution {
  idClass: number;
  classNumber: number;
  classLetter: string;
  distribution: GradeDistribution;
}

interface StudentDistribution {
  studentId: number;
  firstName: string;
  lastName: string;
  distribution: GradeDistribution;
}

interface SubjectDistribution {
  idSubject: number;
  subjectName: string;
  distribution: GradeDistribution;
}

interface ApiStatisticsResponse {
  data?: any[];
  [key: string]: any;
}

export const Statistics = () => {
  const [classAvgGrades, setClassAvgGrades] = useState<ClassAvgGrade[]>([]);
  const [studentAvgGrades, setStudentAvgGrades] = useState<StudentAvgGrade[]>(
    []
  );
  const [subjectAvgGrades, setSubjectAvgGrades] = useState<SubjectAvgGrade[]>(
    []
  );
  const [classDistribution, setClassDistribution] = useState<
    ClassDistribution[]
  >([]);
  const [studentDistribution, setStudentDistribution] = useState<
    StudentDistribution[]
  >([]);
  const [subjectDistribution, setSubjectDistribution] = useState<
    SubjectDistribution[]
  >([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedClass, setSelectedClass] = useState<number>(0);
  const [selectedStudent, setSelectedStudent] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<number>(0);
  const [chartType, setChartType] = useState<string>("column");

  const token = localStorage.getItem("accessToken") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          classGradesResponse,
          studentGradesResponse,
          subjectGradesResponse,
          classDistributionResponse,
          studentDistributionResponse,
          subjectDistributionResponse,
        ] = await Promise.all([
          getAvgGradesByClass(token),
          getAvgGradesByStudent(token),
          getAvgGradesBySubject(token),
          getGradeDistributionByClass(token),
          getGradeDistributionByStudent(token),
          getGradeDistributionBySubject(token),
        ]);

        const classGrades = Array.isArray(classGradesResponse)
          ? classGradesResponse
          : (classGradesResponse as ApiStatisticsResponse)?.data || [];

        const studentGrades = Array.isArray(studentGradesResponse)
          ? studentGradesResponse
          : (studentGradesResponse as ApiStatisticsResponse)?.data || [];

        const subjectGrades = Array.isArray(subjectGradesResponse)
          ? subjectGradesResponse
          : (subjectGradesResponse as ApiStatisticsResponse)?.data || [];

        const classDistrib = Array.isArray(classDistributionResponse)
          ? classDistributionResponse
          : (classDistributionResponse as ApiStatisticsResponse)?.data || [];

        const studentDistrib = Array.isArray(studentDistributionResponse)
          ? studentDistributionResponse
          : (studentDistributionResponse as ApiStatisticsResponse)?.data || [];

        const subjectDistrib = Array.isArray(subjectDistributionResponse)
          ? subjectDistributionResponse
          : (subjectDistributionResponse as ApiStatisticsResponse)?.data || [];

        setClassAvgGrades(classGrades);
        setStudentAvgGrades(studentGrades);
        setSubjectAvgGrades(subjectGrades);
        setClassDistribution(classDistrib);
        setStudentDistribution(studentDistrib);
        setSubjectDistribution(subjectDistrib);

        if (classDistrib.length > 0) {
          setSelectedClass(classDistrib[0].idClass);
        }
        if (studentDistrib.length > 0) {
          setSelectedStudent(studentDistrib[0].studentId);
        }
        if (subjectDistrib.length > 0) {
          setSelectedSubject(subjectDistrib[0].idSubject);
        }
      } catch (error) {
        console.error("Error fetching statistics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const formatAvgGrade = (grade: number) => {
    return grade > 0 ? grade.toFixed(2) : "Н/Д";
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 4.5) return "#52c41a";
    if (grade >= 3.5) return "#1890ff";
    if (grade >= 2.5) return "#faad14";
    if (grade > 0) return "#f5222d";
    return "#d9d9d9";
  };

  const calculateTotalGrades = (distribution: GradeDistribution) => {
    return (
      distribution["2"] +
      distribution["3"] +
      distribution["4"] +
      distribution["5"]
    );
  };

  const calculateGPA = (distribution: GradeDistribution) => {
    const total = calculateTotalGrades(distribution);
    if (total === 0) return 0;

    return (
      (distribution["2"] * 2 +
        distribution["3"] * 3 +
        distribution["4"] * 4 +
        distribution["5"] * 5) /
      total
    );
  };

  const getOverallDistribution = () => {
    const overall = { "2": 0, "3": 0, "4": 0, "5": 0 };

    if (Array.isArray(classDistribution)) {
      classDistribution.forEach((cls) => {
        overall["2"] += cls.distribution["2"];
        overall["3"] += cls.distribution["3"];
        overall["4"] += cls.distribution["4"];
        overall["5"] += cls.distribution["5"];
      });
    }

    return [
      { grade: "5", count: overall["5"] },
      { grade: "4", count: overall["4"] },
      { grade: "3", count: overall["3"] },
      { grade: "2", count: overall["2"] },
    ];
  };

  const renderPieChart = (
    data: { name: string; value: number; color: string }[]
  ) => {
    if (!data || data.length === 0 || data.every((item) => item.value === 0)) {
      return <Empty description="Нет данных для отображения" />;
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, "Количество"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderBarChart = (
    data: { name: string; value: number; color: string }[]
  ) => {
    if (!data || data.length === 0) {
      return <Empty description="Нет данных для отображения" />;
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={45}
            textAnchor="start"
            height={80}
            interval={0}
            tick={{ fontSize: 10 }}
          />
          <YAxis domain={[0, 5]} />
          <Tooltip
            formatter={(value) => {
              const numValue =
                typeof value === "number" ? value : parseFloat(value as string);
              return [numValue.toFixed(2), "Средний балл"];
            }}
          />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderHorizontalBarChart = (
    data: { name: string; value: number; color: string }[]
  ) => {
    if (!data || data.length === 0) {
      return <Empty description="Нет данных для отображения" />;
    }

    return (
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 5]} />
          <YAxis
            dataKey="name"
            type="category"
            width={140}
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            formatter={(value) => {
              const numValue =
                typeof value === "number" ? value : parseFloat(value as string);
              return [numValue.toFixed(2), "Средний балл"];
            }}
          />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const items = [
    {
      key: "overview",
      label: (
        <span>
          <BarChartOutlined /> Общая статистика
        </span>
      ),
      children: (
        <div className={styles.statistics__overview}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card className={styles.statistics__card}>
                <Statistic
                  title="Средний балл по школе"
                  value={calculateGPA({
                    "2":
                      getOverallDistribution().find(
                        (item) => item.grade === "2"
                      )?.count || 0,
                    "3":
                      getOverallDistribution().find(
                        (item) => item.grade === "3"
                      )?.count || 0,
                    "4":
                      getOverallDistribution().find(
                        (item) => item.grade === "4"
                      )?.count || 0,
                    "5":
                      getOverallDistribution().find(
                        (item) => item.grade === "5"
                      )?.count || 0,
                  })}
                  precision={2}
                  valueStyle={{
                    color: getGradeColor(
                      calculateGPA({
                        "2":
                          getOverallDistribution().find(
                            (item) => item.grade === "2"
                          )?.count || 0,
                        "3":
                          getOverallDistribution().find(
                            (item) => item.grade === "3"
                          )?.count || 0,
                        "4":
                          getOverallDistribution().find(
                            (item) => item.grade === "4"
                          )?.count || 0,
                        "5":
                          getOverallDistribution().find(
                            (item) => item.grade === "5"
                          )?.count || 0,
                      })
                    ),
                  }}
                  prefix={<TrophyOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className={styles.statistics__card}>
                <Statistic
                  title="Всего классов"
                  value={classAvgGrades.length}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className={styles.statistics__card}>
                <Statistic
                  title="Всего учеников"
                  value={studentAvgGrades.length}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className={styles.statistics__card}>
                <Statistic
                  title="Всего предметов"
                  value={subjectAvgGrades.length}
                  prefix={<BookOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={12}>
              <Card
                title="Распределение оценок по школе"
                className={styles.statistics__chartCard}
              >
                {renderPieChart([
                  {
                    name: "Отлично (5)",
                    value:
                      getOverallDistribution().find(
                        (item) => item.grade === "5"
                      )?.count || 0,
                    color: "#52c41a",
                  },
                  {
                    name: "Хорошо (4)",
                    value:
                      getOverallDistribution().find(
                        (item) => item.grade === "4"
                      )?.count || 0,
                    color: "#1890ff",
                  },
                  {
                    name: "Удовлетворительно (3)",
                    value:
                      getOverallDistribution().find(
                        (item) => item.grade === "3"
                      )?.count || 0,
                    color: "#faad14",
                  },
                  {
                    name: "Неудовлетворительно (2)",
                    value:
                      getOverallDistribution().find(
                        (item) => item.grade === "2"
                      )?.count || 0,
                    color: "#f5222d",
                  },
                ])}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title="Средние баллы по классам"
                className={styles.statistics__chartCard}
              >
                {renderBarChart(
                  classAvgGrades.map((cls) => ({
                    name: `${cls.classNumber}${cls.classLetter}`,
                    value: cls.averageGrade,
                    color: getGradeColor(cls.averageGrade),
                  }))
                )}
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: "classes",
      label: (
        <span>
          <TeamOutlined /> По классам
        </span>
      ),
      children: (
        <div className={styles.statistics__classes}>
          <Card
            title="Статистика по классам"
            className={styles.statistics__card}
          >
            <Table
              dataSource={classAvgGrades}
              rowKey="idClass"
              pagination={{ pageSize: 10 }}
              columns={[
                {
                  title: "Класс",
                  key: "class",
                  render: (record: ClassAvgGrade) => (
                    <Tag color="blue">
                      {record.classNumber}
                      {record.classLetter}
                    </Tag>
                  ),
                  sorter: (a: ClassAvgGrade, b: ClassAvgGrade) =>
                    a.classNumber - b.classNumber ||
                    a.classLetter.localeCompare(b.classLetter),
                },
                {
                  title: "Количество учеников",
                  dataIndex: "studentCount",
                  key: "studentCount",
                  sorter: (a: ClassAvgGrade, b: ClassAvgGrade) =>
                    a.studentCount - b.studentCount,
                },
                {
                  title: "Средний балл",
                  dataIndex: "averageGrade",
                  key: "averageGrade",
                  render: (grade: number) => (
                    <Tag
                      color={
                        getGradeColor(grade) === "#52c41a"
                          ? "green"
                          : getGradeColor(grade) === "#1890ff"
                          ? "blue"
                          : getGradeColor(grade) === "#faad14"
                          ? "orange"
                          : "red"
                      }
                    >
                      {formatAvgGrade(grade)}
                    </Tag>
                  ),
                  sorter: (a: ClassAvgGrade, b: ClassAvgGrade) =>
                    a.averageGrade - b.averageGrade,
                },
                {
                  title: "Классный руководитель",
                  key: "teacher",
                  render: (record: ClassAvgGrade) =>
                    record.classTeacher ? (
                      <div className={styles.statistics__teacher}>
                        <Avatar size="small">
                          {getInitials(
                            record.classTeacher.firstName,
                            record.classTeacher.lastName
                          )}
                        </Avatar>
                        <span style={{ marginLeft: 8 }}>
                          {record.classTeacher.lastName}{" "}
                          {record.classTeacher.firstName}
                        </span>
                      </div>
                    ) : (
                      <Text type="secondary">Не назначен</Text>
                    ),
                },
              ]}
            />
          </Card>

          <Card
            title="Средние баллы по классам"
            className={styles.statistics__chartCard}
            style={{ marginTop: 16 }}
          >
            <Space style={{ marginBottom: 16 }}>
              <Text>Тип диаграммы:</Text>
              <Radio.Group
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <Radio.Button value="column">Столбцы</Radio.Button>
                <Radio.Button value="bar">Полосы</Radio.Button>
              </Radio.Group>
            </Space>
            {chartType === "column"
              ? renderBarChart(
                  classAvgGrades.map((cls) => ({
                    name: `${cls.classNumber}${cls.classLetter}`,
                    value: cls.averageGrade,
                    color: getGradeColor(cls.averageGrade),
                  }))
                )
              : renderHorizontalBarChart(
                  classAvgGrades.map((cls) => ({
                    name: `${cls.classNumber}${cls.classLetter}`,
                    value: cls.averageGrade,
                    color: getGradeColor(cls.averageGrade),
                  }))
                )}
          </Card>
        </div>
      ),
    },
    {
      key: "students",
      label: (
        <span>
          <UserOutlined /> По ученикам
        </span>
      ),
      children: (
        <div className={styles.statistics__students}>
          <Card
            title="Статистика по ученикам"
            className={styles.statistics__card}
          >
            <Table
              dataSource={studentAvgGrades}
              rowKey="idStudent"
              pagination={{ pageSize: 10 }}
              columns={[
                {
                  title: "ФИО",
                  key: "name",
                  render: (record: StudentAvgGrade) => (
                    <div className={styles.statistics__student}>
                      <Avatar size="small">
                        {getInitials(record.firstName, record.lastName)}
                      </Avatar>
                      <span style={{ marginLeft: 8 }}>
                        {record.lastName} {record.firstName}{" "}
                        {record.middleName || ""}
                      </span>
                    </div>
                  ),
                  sorter: (a: StudentAvgGrade, b: StudentAvgGrade) =>
                    a.lastName.localeCompare(b.lastName),
                },
                {
                  title: "Класс",
                  key: "class",
                  render: (record: StudentAvgGrade) => (
                    <Tag color="blue">
                      {record.class.classNumber}
                      {record.class.classLetter}
                    </Tag>
                  ),
                  sorter: (a: StudentAvgGrade, b: StudentAvgGrade) =>
                    a.class.classNumber - b.class.classNumber ||
                    a.class.classLetter.localeCompare(b.class.classLetter),
                },
                {
                  title: "Средний балл",
                  dataIndex: "averageGrade",
                  key: "averageGrade",
                  render: (grade: number) => (
                    <Tag
                      color={
                        getGradeColor(grade) === "#52c41a"
                          ? "green"
                          : getGradeColor(grade) === "#1890ff"
                          ? "blue"
                          : getGradeColor(grade) === "#faad14"
                          ? "orange"
                          : "red"
                      }
                    >
                      {formatAvgGrade(grade)}
                    </Tag>
                  ),
                  sorter: (a: StudentAvgGrade, b: StudentAvgGrade) =>
                    a.averageGrade - b.averageGrade,
                },
              ]}
            />
          </Card>
        </div>
      ),
    },
    {
      key: "subjects",
      label: (
        <span>
          <BookOutlined /> По предметам
        </span>
      ),
      children: (
        <div className={styles.statistics__subjects}>
          <Card
            title="Статистика по предметам"
            className={styles.statistics__card}
          >
            <Table
              dataSource={subjectAvgGrades}
              rowKey="idSubject"
              pagination={{ pageSize: 10 }}
              columns={[
                {
                  title: "Предмет",
                  dataIndex: "subjectName",
                  key: "subjectName",
                  sorter: (a: SubjectAvgGrade, b: SubjectAvgGrade) =>
                    a.subjectName.localeCompare(b.subjectName),
                },
                {
                  title: "Средний балл",
                  dataIndex: "averageGrade",
                  key: "averageGrade",
                  render: (grade: number) => (
                    <Tag
                      color={
                        getGradeColor(grade) === "#52c41a"
                          ? "green"
                          : getGradeColor(grade) === "#1890ff"
                          ? "blue"
                          : getGradeColor(grade) === "#faad14"
                          ? "orange"
                          : "red"
                      }
                    >
                      {formatAvgGrade(grade)}
                    </Tag>
                  ),
                  sorter: (a: SubjectAvgGrade, b: SubjectAvgGrade) =>
                    a.averageGrade - b.averageGrade,
                },
              ]}
            />
          </Card>

          <Card
            title="Средние баллы по предметам"
            className={styles.statistics__chartCard}
            style={{ marginTop: 16 }}
          >
            {renderHorizontalBarChart(
              subjectAvgGrades.map((subject) => ({
                name: subject.subjectName,
                value: subject.averageGrade,
                color: getGradeColor(subject.averageGrade),
              }))
            )}
          </Card>
        </div>
      ),
    },
    {
      key: "distribution",
      label: (
        <span>
          <PieChartOutlined /> Распределение оценок
        </span>
      ),
      children: (
        <div className={styles.statistics__distribution}>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card title="По классам" className={styles.statistics__card}>
                <Select
                  style={{ width: "100%", marginBottom: 16 }}
                  placeholder="Выберите класс"
                  value={selectedClass}
                  onChange={setSelectedClass}
                >
                  {classDistribution.map((cls) => (
                    <Option key={cls.idClass} value={cls.idClass}>
                      {cls.classNumber}
                      {cls.classLetter}
                    </Option>
                  ))}
                </Select>
                {selectedClass > 0 && (
                  <>
                    {(() => {
                      const selectedClassData = classDistribution.find(
                        (cls) => cls.idClass === selectedClass
                      );
                      return selectedClassData
                        ? renderPieChart([
                            {
                              name: "Отлично (5)",
                              value: selectedClassData.distribution["5"],
                              color: "#52c41a",
                            },
                            {
                              name: "Хорошо (4)",
                              value: selectedClassData.distribution["4"],
                              color: "#1890ff",
                            },
                            {
                              name: "Удовлетворительно (3)",
                              value: selectedClassData.distribution["3"],
                              color: "#faad14",
                            },
                            {
                              name: "Неудовлетворительно (2)",
                              value: selectedClassData.distribution["2"],
                              color: "#f5222d",
                            },
                          ])
                        : null;
                    })()}
                  </>
                )}
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="По ученикам" className={styles.statistics__card}>
                <Select
                  style={{ width: "100%", marginBottom: 16 }}
                  placeholder="Выберите ученика"
                  value={selectedStudent}
                  onChange={setSelectedStudent}
                  showSearch
                  optionFilterProp="children"
                >
                  {studentDistribution.map((student) => (
                    <Option key={student.studentId} value={student.studentId}>
                      {student.lastName} {student.firstName}
                    </Option>
                  ))}
                </Select>
                {selectedStudent > 0 && (
                  <>
                    {(() => {
                      const selectedStudentData = studentDistribution.find(
                        (student) => student.studentId === selectedStudent
                      );
                      return selectedStudentData
                        ? renderPieChart([
                            {
                              name: "Отлично (5)",
                              value: selectedStudentData.distribution["5"],
                              color: "#52c41a",
                            },
                            {
                              name: "Хорошо (4)",
                              value: selectedStudentData.distribution["4"],
                              color: "#1890ff",
                            },
                            {
                              name: "Удовлетворительно (3)",
                              value: selectedStudentData.distribution["3"],
                              color: "#faad14",
                            },
                            {
                              name: "Неудовлетворительно (2)",
                              value: selectedStudentData.distribution["2"],
                              color: "#f5222d",
                            },
                          ])
                        : null;
                    })()}
                  </>
                )}
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="По предметам" className={styles.statistics__card}>
                <Select
                  style={{ width: "100%", marginBottom: 16 }}
                  placeholder="Выберите предмет"
                  value={selectedSubject}
                  onChange={setSelectedSubject}
                >
                  {subjectDistribution.map((subject) => (
                    <Option key={subject.idSubject} value={subject.idSubject}>
                      {subject.subjectName}
                    </Option>
                  ))}
                </Select>
                {selectedSubject > 0 && (
                  <>
                    {(() => {
                      const selectedSubjectData = subjectDistribution.find(
                        (subject) => subject.idSubject === selectedSubject
                      );
                      return selectedSubjectData
                        ? renderPieChart([
                            {
                              name: "Отлично (5)",
                              value: selectedSubjectData.distribution["5"],
                              color: "#52c41a",
                            },
                            {
                              name: "Хорошо (4)",
                              value: selectedSubjectData.distribution["4"],
                              color: "#1890ff",
                            },
                            {
                              name: "Удовлетворительно (3)",
                              value: selectedSubjectData.distribution["3"],
                              color: "#faad14",
                            },
                            {
                              name: "Неудовлетворительно (2)",
                              value: selectedSubjectData.distribution["2"],
                              color: "#f5222d",
                            },
                          ])
                        : null;
                    })()}
                  </>
                )}
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {selectedClass > 0 && (
              <Col xs={24} sm={8}>
                <Card className={styles.statistics__summaryCard}>
                  <Statistic
                    title={`Средний балл класса ${
                      classDistribution.find(
                        (cls) => cls.idClass === selectedClass
                      )?.classNumber
                    }${
                      classDistribution.find(
                        (cls) => cls.idClass === selectedClass
                      )?.classLetter
                    }`}
                    value={(() => {
                      const classData = classDistribution.find(
                        (cls) => cls.idClass === selectedClass
                      );
                      return classData
                        ? calculateGPA(classData.distribution)
                        : 0;
                    })()}
                    precision={2}
                    valueStyle={{
                      color: getGradeColor(
                        (() => {
                          const classData = classDistribution.find(
                            (cls) => cls.idClass === selectedClass
                          );
                          return classData
                            ? calculateGPA(classData.distribution)
                            : 0;
                        })()
                      ),
                    }}
                  />
                </Card>
              </Col>
            )}
            {selectedStudent > 0 && (
              <Col xs={24} sm={8}>
                <Card className={styles.statistics__summaryCard}>
                  <Statistic
                    title={`Средний балл ученика ${
                      studentDistribution.find(
                        (student) => student.studentId === selectedStudent
                      )?.lastName
                    } ${
                      studentDistribution.find(
                        (student) => student.studentId === selectedStudent
                      )?.firstName
                    }`}
                    value={(() => {
                      const studentData = studentDistribution.find(
                        (student) => student.studentId === selectedStudent
                      );
                      return studentData
                        ? calculateGPA(studentData.distribution)
                        : 0;
                    })()}
                    precision={2}
                    valueStyle={{
                      color: getGradeColor(
                        (() => {
                          const studentData = studentDistribution.find(
                            (student) => student.studentId === selectedStudent
                          );
                          return studentData
                            ? calculateGPA(studentData.distribution)
                            : 0;
                        })()
                      ),
                    }}
                  />
                </Card>
              </Col>
            )}
            {selectedSubject > 0 && (
              <Col xs={24} sm={8}>
                <Card className={styles.statistics__summaryCard}>
                  <Statistic
                    title={`Средний балл по предмету ${
                      subjectDistribution.find(
                        (subject) => subject.idSubject === selectedSubject
                      )?.subjectName
                    }`}
                    value={(() => {
                      const subjectData = subjectDistribution.find(
                        (subject) => subject.idSubject === selectedSubject
                      );
                      return subjectData
                        ? calculateGPA(subjectData.distribution)
                        : 0;
                    })()}
                    precision={2}
                    valueStyle={{
                      color: getGradeColor(
                        (() => {
                          const subjectData = subjectDistribution.find(
                            (subject) => subject.idSubject === selectedSubject
                          );
                          return subjectData
                            ? calculateGPA(subjectData.distribution)
                            : 0;
                        })()
                      ),
                    }}
                  />
                </Card>
              </Col>
            )}
          </Row>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className={styles.statistics__loading}>
        <Spin size="large" />
        <Text style={{ marginTop: 16, display: "block", textAlign: "center" }}>
          Загрузка статистики...
        </Text>
      </div>
    );
  }

  const hasData =
    classAvgGrades.length > 0 ||
    studentAvgGrades.length > 0 ||
    subjectAvgGrades.length > 0;

  if (!hasData) {
    return (
      <div className={styles.statistics__empty}>
        <Empty
          description="Нет данных для отображения статистики"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Alert
          message="Информация"
          description="Статистика будет доступна после добавления оценок в систему."
          type="info"
          showIcon
          style={{ marginTop: 16, maxWidth: 400, margin: "16px auto" }}
        />
      </div>
    );
  }

  return (
    <div className={styles.statistics}>
      <div className={styles.statistics__header}>
        <Title level={2} className={styles.statistics__title}>
          <BarChartOutlined className={styles.statistics__titleIcon} />
          Статистика успеваемости
        </Title>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        className={styles.statistics__tabs}
      />
    </div>
  );
};
