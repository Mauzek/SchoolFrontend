import React, { useEffect, useState } from "react";
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
  LineChartOutlined,
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
  LineChart,
  Line,
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

// Define interfaces for data structures
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

export const Statistics = () => {
  // State for data
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

  // UI state
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedClass, setSelectedClass] = useState<number>(0);
  const [selectedStudent, setSelectedStudent] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<number>(0);
  const [chartType, setChartType] = useState<string>("column");

  // Get token from localStorage
  const token = localStorage.getItem("accessToken") || "";

  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      // In your fetchData function
      // In your fetchData function
      try {
        setLoading(true);

        // Fetch all data in parallel
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

        console.log("API Responses:", {
          classGrades: classGradesResponse,
          studentGrades: studentGradesResponse,
          subjectGrades: subjectGradesResponse,
          classDistribution: classDistributionResponse,
          studentDistribution: studentDistributionResponse,
          subjectDistribution: subjectDistributionResponse,
        });

        // Extract the array data from the responses
        // You'll need to adjust these based on the actual structure of your responses
        const classGrades = classGradesResponse?.data || [];
        const studentGrades = studentGradesResponse?.data || [];
        const subjectGrades = subjectGradesResponse?.data || [];
        const classDistrib = classDistributionResponse?.data || [];
        const studentDistrib = studentDistributionResponse?.data || [];
        const subjectDistrib = subjectDistributionResponse?.data || [];

        // Set state with extracted data
        setClassAvgGrades(classGrades);
        setStudentAvgGrades(studentGrades);
        setSubjectAvgGrades(subjectGrades);
        setClassDistribution(classDistrib);
        setStudentDistribution(studentDistrib);
        setSubjectDistribution(subjectDistrib);

        // Set initial selections if data exists
        if (classDistrib.length > 0) {
          setSelectedClass(classDistrib[0].idClass);
        }
        if (studentDistrib.length > 0) {
          setSelectedStudent(studentDistrib[0].studentId);
        }
        if (subjectDistrib.length > 0) {
          setSelectedSubject(subjectDistrib[0].idSubject);
        }

        console.log("State after setting:", {
          classAvgGrades: classGrades,
          studentAvgGrades: studentGrades,
          subjectAvgGrades: subjectGrades,
          classDistribution: classDistrib,
          studentDistribution: studentDistrib,
          subjectDistribution: subjectDistrib,
        });
      } catch (error) {
        console.error("Error fetching statistics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // После установки состояния добавим проверку текущих значений
  useEffect(() => {
    console.log("Current selections:", {
      selectedClass,
      selectedStudent,
      selectedSubject,
    });
  }, [selectedClass, selectedStudent, selectedSubject]);

  // Helper functions
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const formatAvgGrade = (grade: number) => {
    return grade > 0 ? grade.toFixed(2) : "Н/Д";
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 4.5) return "#52c41a"; // Green
    if (grade >= 3.5) return "#1890ff"; // Blue
    if (grade >= 2.5) return "#faad14"; // Yellow
    if (grade > 0) return "#f5222d"; // Red
    return "#d9d9d9"; // Grey for no data
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

  // Get overall distribution data
  const getOverallDistribution = () => {
    const overall = { "2": 0, "3": 0, "4": 0, "5": 0 };

    // Check if classDistribution is an array before using forEach
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

  // Render recharts PieChart for grade distribution
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

  // Render recharts BarChart
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
          <Tooltip formatter={(value) => [value.toFixed(2), "Средний балл"]} />

          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Render recharts LineChart
  const renderLineChart = (
    data: { name: string; value: number; color: string }[]
  ) => {
    if (!data || data.length === 0) {
      return <Empty description="Нет данных для отображения" />;
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
          <Tooltip formatter={(value) => [value.toFixed(2), "Средний балл"]} />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // Render horizontal bar chart
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
            formatter={(value: number) => [value.toFixed(2), "Средний балл"]}
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

  // Define the tabs items array for the Tabs component
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
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className={styles.statistics__card}>
                <Statistic
                  title="Всего учеников"
                  value={classAvgGrades.reduce(
                    (sum, cls) => sum + cls.studentCount,
                    0
                  )}
                  groupSeparator=" "
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className={styles.statistics__card}>
                <Statistic
                  title="Всего классов"
                  value={classAvgGrades.length}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className={styles.statistics__card}>
                <Statistic
                  title="Всего предметов"
                  value={subjectAvgGrades.length}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} md={12}>
              <Card
                title={
                  <div className={styles.statistics__cardTitle}>
                    <PieChartOutlined /> Распределение оценок
                  </div>
                }
                className={styles.statistics__chartCard}
              >
                {calculateTotalGrades({
                  "2":
                    getOverallDistribution().find((item) => item.grade === "2")
                      ?.count || 0,
                  "3":
                    getOverallDistribution().find((item) => item.grade === "3")
                      ?.count || 0,
                  "4":
                    getOverallDistribution().find((item) => item.grade === "4")
                      ?.count || 0,
                  "5":
                    getOverallDistribution().find((item) => item.grade === "5")
                      ?.count || 0,
                }) > 0 ? (
                  renderPieChart([
                    {
                      name: "Оценка 5",
                      value:
                        getOverallDistribution().find(
                          (item) => item.grade === "5"
                        )?.count || 0,
                      color: "#52c41a",
                    },
                    {
                      name: "Оценка 4",
                      value:
                        getOverallDistribution().find(
                          (item) => item.grade === "4"
                        )?.count || 0,
                      color: "#1890ff",
                    },
                    {
                      name: "Оценка 3",
                      value:
                        getOverallDistribution().find(
                          (item) => item.grade === "3"
                        )?.count || 0,
                      color: "#faad14",
                    },
                    {
                      name: "Оценка 2",
                      value:
                        getOverallDistribution().find(
                          (item) => item.grade === "2"
                        )?.count || 0,
                      color: "#f5222d",
                    },
                  ])
                ) : (
                  <Empty description="Нет данных для отображения" />
                )}
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                title={
                  <div className={styles.statistics__cardTitle}>
                    <BarChartOutlined /> Средний балл по предметам
                  </div>
                }
                className={styles.statistics__chartCard}
              >
                {subjectAvgGrades.length > 0 ? (
                  renderBarChart(
                    subjectAvgGrades
                      .filter((subject) => subject.averageGrade > 0)
                      .map((subject) => ({
                        name: subject.subjectName,
                        value: subject.averageGrade,
                        color: getGradeColor(subject.averageGrade),
                      }))
                      .sort((a, b) => b.value - a.value)
                  )
                ) : (
                  <Empty description="Нет данных для отображения" />
                )}
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} md={8}>
              <Card
                title={
                  <div className={styles.statistics__cardTitle}>
                    <TrophyOutlined /> Лучший класс
                  </div>
                }
                className={styles.statistics__bestCard}
              >
                {classAvgGrades.length > 0 ? (
                  <div className={styles.statistics__bestItem}>
                    <div>
                      <div className={styles.statistics__bestHeader}>
                        <Avatar size={40} className={styles.statistics__avatar}>
                          {classAvgGrades
                            .filter((cls) => cls.averageGrade > 0)
                            .sort((a, b) => b.averageGrade - a.averageGrade)[0]
                            ?.classNumber || ""}
                          {classAvgGrades
                            .filter((cls) => cls.averageGrade > 0)
                            .sort((a, b) => b.averageGrade - a.averageGrade)[0]
                            ?.classLetter || ""}
                        </Avatar>
                        <Title
                          level={4}
                          className={styles.statistics__bestTitle}
                        >
                          {classAvgGrades
                            .filter((cls) => cls.averageGrade > 0)
                            .sort((a, b) => b.averageGrade - a.averageGrade)[0]
                            ?.classNumber || ""}
                          {classAvgGrades
                            .filter((cls) => cls.averageGrade > 0)
                            .sort((a, b) => b.averageGrade - a.averageGrade)[0]
                            ?.classLetter || ""}
                        </Title>
                      </div>
                      <div className={styles.statistics__bestDetails}>
                        <div>
                          <Text type="secondary">Средний балл:</Text>{" "}
                          <Text
                            strong
                            style={{
                              color: getGradeColor(
                                classAvgGrades
                                  .filter((cls) => cls.averageGrade > 0)
                                  .sort(
                                    (a, b) => b.averageGrade - a.averageGrade
                                  )[0]?.averageGrade || 0
                              ),
                            }}
                          >
                            {formatAvgGrade(
                              classAvgGrades
                                .filter((cls) => cls.averageGrade > 0)
                                .sort(
                                  (a, b) => b.averageGrade - a.averageGrade
                                )[0]?.averageGrade || 0
                            )}
                          </Text>
                        </div>
                        <div>
                          <Text type="secondary">Учеников:</Text>{" "}
                          <Text strong>
                            {classAvgGrades
                              .filter((cls) => cls.averageGrade > 0)
                              .sort(
                                (a, b) => b.averageGrade - a.averageGrade
                              )[0]?.studentCount || 0}
                          </Text>
                        </div>
                        <div>
                          <Text type="secondary">Классный руководитель:</Text>{" "}
                          <Text strong>
                            {classAvgGrades
                              .filter((cls) => cls.averageGrade > 0)
                              .sort(
                                (a, b) => b.averageGrade - a.averageGrade
                              )[0]?.classTeacher?.lastName || ""}{" "}
                            {classAvgGrades
                              .filter((cls) => cls.averageGrade > 0)
                              .sort(
                                (a, b) => b.averageGrade - a.averageGrade
                              )[0]?.classTeacher?.firstName || ""}
                          </Text>
                        </div>
                      </div>
                    </div>
                    <div className={styles.statistics__bestGrade}>
                      <Tag
                        color={getGradeColor(
                          classAvgGrades
                            .filter((cls) => cls.averageGrade > 0)
                            .sort((a, b) => b.averageGrade - a.averageGrade)[0]
                            ?.averageGrade || 0
                        )}
                        style={{ fontSize: 20, padding: "8px 16px" }}
                      >
                        {formatAvgGrade(
                          classAvgGrades
                            .filter((cls) => cls.averageGrade > 0)
                            .sort((a, b) => b.averageGrade - a.averageGrade)[0]
                            ?.averageGrade || 0
                        )}
                      </Tag>
                    </div>
                  </div>
                ) : (
                  <Empty description="Нет данных для отображения" />
                )}
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                title={
                  <div className={styles.statistics__cardTitle}>
                    <TrophyOutlined /> Лучший ученик
                  </div>
                }
                className={styles.statistics__bestCard}
              >
                {studentAvgGrades.length > 0 ? (
                  <div className={styles.statistics__bestItem}>
                    <div>
                      <div className={styles.statistics__bestHeader}>
                        <Avatar size={40} className={styles.statistics__avatar}>
                          {getInitials(
                            studentAvgGrades
                              .filter((student) => student.averageGrade > 0)
                              .sort(
                                (a, b) => b.averageGrade - a.averageGrade
                              )[0]?.firstName || "",
                            studentAvgGrades
                              .filter((student) => student.averageGrade > 0)
                              .sort(
                                (a, b) => b.averageGrade - a.averageGrade
                              )[0]?.lastName || ""
                          )}
                        </Avatar>
                        <Title
                          level={4}
                          className={styles.statistics__bestTitle}
                        >
                          {studentAvgGrades
                            .filter((student) => student.averageGrade > 0)
                            .sort((a, b) => b.averageGrade - a.averageGrade)[0]
                            ?.lastName || ""}{" "}
                          {studentAvgGrades
                            .filter((student) => student.averageGrade > 0)
                            .sort((a, b) => b.averageGrade - a.averageGrade)[0]
                            ?.firstName || ""}
                        </Title>
                      </div>
                      <div className={styles.statistics__bestDetails}>
                        <div>
                          <Text type="secondary">Средний балл:</Text>{" "}
                          <Text
                            strong
                            style={{
                              color: getGradeColor(
                                studentAvgGrades
                                  .filter((student) => student.averageGrade > 0)
                                  .sort(
                                    (a, b) => b.averageGrade - a.averageGrade
                                  )[0]?.averageGrade || 0
                              ),
                            }}
                          >
                            {formatAvgGrade(
                              studentAvgGrades
                                .filter((student) => student.averageGrade > 0)
                                .sort(
                                  (a, b) => b.averageGrade - a.averageGrade
                                )[0]?.averageGrade || 0
                            )}
                          </Text>
                        </div>
                        <div>
                          <Text type="secondary">Класс:</Text>{" "}
                          <Tag
                            color="blue"
                            className={styles.statistics__classTag}
                          >
                            {studentAvgGrades
                              .filter((student) => student.averageGrade > 0)
                              .sort(
                                (a, b) => b.averageGrade - a.averageGrade
                              )[0]?.class.classNumber || ""}
                            {studentAvgGrades
                              .filter((student) => student.averageGrade > 0)
                              .sort(
                                (a, b) => b.averageGrade - a.averageGrade
                              )[0]?.class.classLetter || ""}
                          </Tag>
                        </div>
                      </div>
                    </div>
                    <div className={styles.statistics__bestGrade}>
                      <Tag
                        color={getGradeColor(
                          studentAvgGrades
                            .filter((student) => student.averageGrade > 0)
                            .sort((a, b) => b.averageGrade - a.averageGrade)[0]
                            ?.averageGrade || 0
                        )}
                        style={{ fontSize: 20, padding: "8px 16px" }}
                      >
                        {formatAvgGrade(
                          studentAvgGrades
                            .filter((student) => student.averageGrade > 0)
                            .sort((a, b) => b.averageGrade - a.averageGrade)[0]
                            ?.averageGrade || 0
                        )}
                      </Tag>
                    </div>
                  </div>
                ) : (
                  <Empty description="Нет данных для отображения" />
                )}
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                title={
                  <div className={styles.statistics__cardTitle}>
                    <TrophyOutlined /> Лучший предмет
                  </div>
                }
                className={styles.statistics__bestCard}
              >
                {subjectAvgGrades.length > 0 ? (
                  <div className={styles.statistics__bestItem}>
                    <div>
                      <div className={styles.statistics__bestHeader}>
                        <Avatar size={40} className={styles.statistics__avatar}>
                          {subjectAvgGrades
                            .filter((subject) => subject.averageGrade > 0)
                            .sort((a, b) => b.averageGrade - a.averageGrade)[0]
                            ?.subjectName.charAt(0) || ""}
                        </Avatar>
                        <Title
                          level={4}
                          className={styles.statistics__bestTitle}
                        >
                          {subjectAvgGrades
                            .filter((subject) => subject.averageGrade > 0)
                            .sort((a, b) => b.averageGrade - a.averageGrade)[0]
                            ?.subjectName || ""}
                        </Title>
                      </div>
                      <div className={styles.statistics__bestDetails}>
                        <div>
                          <Text type="secondary">Средний балл:</Text>{" "}
                          <Text
                            strong
                            style={{
                              color: getGradeColor(
                                subjectAvgGrades
                                  .filter((subject) => subject.averageGrade > 0)
                                  .sort(
                                    (a, b) => b.averageGrade - a.averageGrade
                                  )[0]?.averageGrade || 0
                              ),
                            }}
                          >
                            {formatAvgGrade(
                              subjectAvgGrades
                                .filter((subject) => subject.averageGrade > 0)
                                .sort(
                                  (a, b) => b.averageGrade - a.averageGrade
                                )[0]?.averageGrade || 0
                            )}
                          </Text>
                        </div>
                      </div>
                    </div>
                    <div className={styles.statistics__bestGrade}>
                      <Tag
                        color={getGradeColor(
                          subjectAvgGrades
                            .filter((subject) => subject.averageGrade > 0)
                            .sort((a, b) => b.averageGrade - a.averageGrade)[0]
                            ?.averageGrade || 0
                        )}
                        style={{ fontSize: 20, padding: "8px 16px" }}
                      >
                        {formatAvgGrade(
                          subjectAvgGrades
                            .filter((subject) => subject.averageGrade > 0)
                            .sort((a, b) => b.averageGrade - a.averageGrade)[0]
                            ?.averageGrade || 0
                        )}
                      </Tag>
                    </div>
                  </div>
                ) : (
                  <Empty description="Нет данных для отображения" />
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
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card
                title={
                  <div className={styles.statistics__cardTitle}>
                    <BarChartOutlined /> Средний балл по классам
                  </div>
                }
                className={styles.statistics__chartCard}
              >
                {classAvgGrades.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={classAvgGrades
                        .filter((cls) => cls.averageGrade > 0)
                        .map((cls) => ({
                          name: `${cls.classNumber}${cls.classLetter}`,
                          grade: cls.averageGrade,
                          students: cls.studentCount,
                        }))
                        .sort((a, b) => a.name.localeCompare(b.name))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        domain={[0, 5]}
                      />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="grade"
                        name="Средний балл"
                        fill="#8884d8"
                      >
                        {classAvgGrades
                          .filter((cls) => cls.averageGrade > 0)
                          .map((cls, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={getGradeColor(cls.averageGrade)}
                            />
                          ))}
                      </Bar>
                      <Bar
                        yAxisId="right"
                        dataKey="students"
                        name="Количество учеников"
                        fill="#82ca9d"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="Нет данных для отображения" />
                )}
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} md={12}>
              <Card
                title={
                  <div className={styles.statistics__cardTitle}>
                    <div>
                      <PieChartOutlined /> Распределение оценок
                      {classDistribution.find(
                        (cls) => cls.idClass === selectedClass
                      ) && (
                        <span className={styles.statistics__subtitle}>
                          {" "}
                          (
                          {classDistribution.find(
                            (cls) => cls.idClass === selectedClass
                          )?.classNumber || ""}
                          {classDistribution.find(
                            (cls) => cls.idClass === selectedClass
                          )?.classLetter || ""}
                          )
                        </span>
                      )}
                    </div>
                    <Select
                      value={selectedClass}
                      onChange={setSelectedClass}
                      className={styles.statistics__select}
                      placeholder="Выберите класс"
                    >
                      {classDistribution.map((cls) => (
                        <Option key={cls.idClass} value={cls.idClass}>
                          {cls.classNumber}
                          {cls.classLetter}
                        </Option>
                      ))}
                    </Select>
                  </div>
                }
                className={styles.statistics__chartCard}
              >
                {classDistribution.find(
                  (cls) => cls.idClass === selectedClass
                ) &&
                calculateTotalGrades(
                  classDistribution.find((cls) => cls.idClass === selectedClass)
                    ?.distribution || { "2": 0, "3": 0, "4": 0, "5": 0 }
                ) > 0 ? (
                  renderPieChart([
                    {
                      name: "Оценка 5",
                      value:
                        classDistribution.find(
                          (cls) => cls.idClass === selectedClass
                        )?.distribution["5"] || 0,
                      color: "#52c41a",
                    },
                    {
                      name: "Оценка 4",
                      value:
                        classDistribution.find(
                          (cls) => cls.idClass === selectedClass
                        )?.distribution["4"] || 0,
                      color: "#1890ff",
                    },
                    {
                      name: "Оценка 3",
                      value:
                        classDistribution.find(
                          (cls) => cls.idClass === selectedClass
                        )?.distribution["3"] || 0,
                      color: "#faad14",
                    },
                    {
                      name: "Оценка 2",
                      value:
                        classDistribution.find(
                          (cls) => cls.idClass === selectedClass
                        )?.distribution["2"] || 0,
                      color: "#f5222d",
                    },
                  ])
                ) : (
                  <Empty description="Нет данных для отображения" />
                )}
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                title={
                  <div className={styles.statistics__cardTitle}>
                    <BarChartOutlined /> Статистика по классам
                  </div>
                }
                className={styles.statistics__chartCard}
              >
                <Table
                  dataSource={classAvgGrades.map((cls) => ({
                    key: cls.idClass,
                    class: `${cls.classNumber}${cls.classLetter}`,
                    students: cls.studentCount,
                    avgGrade: cls.averageGrade,
                    teacher: cls.classTeacher
                      ? `${
                          cls.classTeacher.lastName
                        } ${cls.classTeacher.firstName.charAt(0)}.`
                      : "Не назначен",
                    quality: classDistribution.find(
                      (c) => c.idClass === cls.idClass
                    )
                      ? (((classDistribution.find(
                          (c) => c.idClass === cls.idClass
                        )?.distribution["4"] || 0) +
                          (classDistribution.find(
                            (c) => c.idClass === cls.idClass
                          )?.distribution["5"] || 0)) /
                          calculateTotalGrades(
                            classDistribution.find(
                              (c) => c.idClass === cls.idClass
                            )?.distribution || {
                              "2": 0,
                              "3": 0,
                              "4": 0,
                              "5": 0,
                            }
                          )) *
                        100
                      : 0,
                  }))}
                  columns={[
                    {
                      title: "Класс",
                      dataIndex: "class",
                      key: "class",
                      sorter: (a, b) => a.class.localeCompare(b.class),
                    },
                    {
                      title: "Учеников",
                      dataIndex: "students",
                      key: "students",
                      sorter: (a, b) => a.students - b.students,
                    },
                    {
                      title: "Средний балл",
                      dataIndex: "avgGrade",
                      key: "avgGrade",
                      sorter: (a, b) => a.avgGrade - b.avgGrade,
                      render: (grade) => (
                        <Tag color={getGradeColor(grade)}>
                          {formatAvgGrade(grade)}
                        </Tag>
                      ),
                    },
                    {
                      title: "Качество знаний",
                      dataIndex: "quality",
                      key: "quality",
                      sorter: (a, b) => a.quality - b.quality,
                      render: (quality) => (
                        <Tag
                          color={
                            quality >= 70
                              ? "#52c41a"
                              : quality >= 50
                              ? "#1890ff"
                              : quality >= 30
                              ? "#faad14"
                              : "#f5222d"
                          }
                        >
                          {isNaN(quality) ? "Н/Д" : `${quality.toFixed(1)}%`}
                        </Tag>
                      ),
                    },
                    {
                      title: "Классный руководитель",
                      dataIndex: "teacher",
                      key: "teacher",
                    },
                  ]}
                  pagination={false}
                  size="middle"
                  className={styles.statistics__table}
                />
              </Card>
            </Col>
          </Row>
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
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card
                title={
                  <div className={styles.statistics__cardTitle}>
                    <div>
                      <PieChartOutlined /> Распределение оценок
                      {studentDistribution.find(
                        (student) => student.studentId === selectedStudent
                      ) && (
                        <span className={styles.statistics__subtitle}>
                          {" "}
                          (
                          {studentDistribution.find(
                            (student) => student.studentId === selectedStudent
                          )?.lastName || ""}{" "}
                          {studentDistribution.find(
                            (student) => student.studentId === selectedStudent
                          )?.firstName || ""}
                          )
                        </span>
                      )}
                    </div>
                    <Select
                      value={selectedStudent}
                      onChange={setSelectedStudent}
                      className={styles.statistics__select}
                      placeholder="Выберите ученика"
                      showSearch
                      optionFilterProp="children"
                    >
                      {studentDistribution.map((student) => (
                        <Option
                          key={student.studentId}
                          value={student.studentId}
                        >
                          {student.lastName} {student.firstName}
                        </Option>
                      ))}
                    </Select>
                  </div>
                }
                className={styles.statistics__chartCard}
              >
                {studentDistribution.find(
                  (student) => student.studentId === selectedStudent
                ) &&
                calculateTotalGrades(
                  studentDistribution.find(
                    (student) => student.studentId === selectedStudent
                  )?.distribution || { "2": 0, "3": 0, "4": 0, "5": 0 }
                ) > 0 ? (
                  renderPieChart([
                    {
                      name: "Оценка 5",
                      value:
                        studentDistribution.find(
                          (student) => student.studentId === selectedStudent
                        )?.distribution["5"] || 0,
                      color: "#52c41a",
                    },
                    {
                      name: "Оценка 4",
                      value:
                        studentDistribution.find(
                          (student) => student.studentId === selectedStudent
                        )?.distribution["4"] || 0,
                      color: "#1890ff",
                    },
                    {
                      name: "Оценка 3",
                      value:
                        studentDistribution.find(
                          (student) => student.studentId === selectedStudent
                        )?.distribution["3"] || 0,
                      color: "#faad14",
                    },
                    {
                      name: "Оценка 2",
                      value:
                        studentDistribution.find(
                          (student) => student.studentId === selectedStudent
                        )?.distribution["2"] || 0,
                      color: "#f5222d",
                    },
                  ])
                ) : (
                  <Empty description="Нет данных для отображения" />
                )}
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                title={
                  <div className={styles.statistics__cardTitle}>
                    <BarChartOutlined /> Лучшие ученики
                  </div>
                }
                className={styles.statistics__chartCard}
              >
                <Table
                  dataSource={studentAvgGrades
                    .filter((student) => student.averageGrade > 0)
                    .sort((a, b) => b.averageGrade - a.averageGrade)
                    .slice(0, 10)
                    .map((student) => ({
                      key: student.idStudent,
                      name: `${student.lastName} ${student.firstName}`,
                      class: `${student.class.classNumber}${student.class.classLetter}`,
                      avgGrade: student.averageGrade,
                      quality: studentDistribution.find(
                        (s) => s.studentId === student.idStudent
                      )
                        ? (((studentDistribution.find(
                            (s) => s.studentId === student.idStudent
                          )?.distribution["4"] || 0) +
                            (studentDistribution.find(
                              (s) => s.studentId === student.idStudent
                            )?.distribution["5"] || 0)) /
                            calculateTotalGrades(
                              studentDistribution.find(
                                (s) => s.studentId === student.idStudent
                              )?.distribution || {
                                "2": 0,
                                "3": 0,
                                "4": 0,
                                "5": 0,
                              }
                            )) *
                          100
                        : 0,
                    }))}
                  columns={[
                    {
                      title: "Ученик",
                      dataIndex: "name",
                      key: "name",
                    },
                    {
                      title: "Класс",
                      dataIndex: "class",
                      key: "class",
                      render: (cls) => <Tag color="blue">{cls}</Tag>,
                    },
                    {
                      title: "Средний балл",
                      dataIndex: "avgGrade",
                      key: "avgGrade",
                      sorter: (a, b) => a.avgGrade - b.avgGrade,
                      render: (grade) => (
                        <Tag color={getGradeColor(grade)}>
                          {formatAvgGrade(grade)}
                        </Tag>
                      ),
                    },
                    {
                      title: "Качество знаний",
                      dataIndex: "quality",
                      key: "quality",
                      sorter: (a, b) => a.quality - b.quality,
                      render: (quality) => (
                        <Tag
                          color={
                            quality >= 70
                              ? "#52c41a"
                              : quality >= 50
                              ? "#1890ff"
                              : quality >= 30
                              ? "#faad14"
                              : "#f5222d"
                          }
                        >
                          {isNaN(quality) ? "Н/Д" : `${quality.toFixed(1)}%`}
                        </Tag>
                      ),
                    },
                  ]}
                  pagination={false}
                  size="middle"
                  className={styles.statistics__table}
                />
              </Card>
            </Col>
          </Row>
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
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card
                title={
                  <div className={styles.statistics__cardTitle}>
                    <div>
                      <PieChartOutlined /> Распределение оценок
                      {subjectDistribution.find(
                        (subject) => subject.idSubject === selectedSubject
                      ) && (
                        <span className={styles.statistics__subtitle}>
                          {" "}
                          (
                          {subjectDistribution.find(
                            (subject) => subject.idSubject === selectedSubject
                          )?.subjectName || ""}
                          )
                        </span>
                      )}
                    </div>
                    <Select
                      value={selectedSubject}
                      onChange={setSelectedSubject}
                      className={styles.statistics__select}
                      placeholder="Выберите предмет"
                    >
                      {subjectDistribution.map((subject) => (
                        <Option
                          key={subject.idSubject}
                          value={subject.idSubject}
                        >
                          {subject.subjectName}
                        </Option>
                      ))}
                    </Select>
                  </div>
                }
                className={styles.statistics__chartCard}
              >
                {subjectDistribution.find(
                  (subject) => subject.idSubject === selectedSubject
                ) &&
                calculateTotalGrades(
                  subjectDistribution.find(
                    (subject) => subject.idSubject === selectedSubject
                  )?.distribution || { "2": 0, "3": 0, "4": 0, "5": 0 }
                ) > 0 ? (
                  renderPieChart([
                    {
                      name: "Оценка 5",
                      value:
                        subjectDistribution.find(
                          (subject) => subject.idSubject === selectedSubject
                        )?.distribution["5"] || 0,
                      color: "#52c41a",
                    },
                    {
                      name: "Оценка 4",
                      value:
                        subjectDistribution.find(
                          (subject) => subject.idSubject === selectedSubject
                        )?.distribution["4"] || 0,
                      color: "#1890ff",
                    },
                    {
                      name: "Оценка 3",
                      value:
                        subjectDistribution.find(
                          (subject) => subject.idSubject === selectedSubject
                        )?.distribution["3"] || 0,
                      color: "#faad14",
                    },
                    {
                      name: "Оценка 2",
                      value:
                        subjectDistribution.find(
                          (subject) => subject.idSubject === selectedSubject
                        )?.distribution["2"] || 0,
                      color: "#f5222d",
                    },
                  ])
                ) : (
                  <Empty description="Нет данных для отображения" />
                )}
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                title={
                  <div className={styles.statistics__cardTitle}>
                    <BarChartOutlined /> Рейтинг предметов
                  </div>
                }
                className={styles.statistics__chartCard}
              >
                <Table
                  dataSource={subjectAvgGrades
                    .filter((subject) => subject.averageGrade > 0)
                    .sort((a, b) => b.averageGrade - a.averageGrade)
                    .map((subject) => ({
                      key: subject.idSubject,
                      subject: subject.subjectName,
                      avgGrade: subject.averageGrade,
                      quality: subjectDistribution.find(
                        (s) => s.idSubject === subject.idSubject
                      )
                        ? (((subjectDistribution.find(
                            (s) => s.idSubject === subject.idSubject
                          )?.distribution["4"] || 0) +
                            (subjectDistribution.find(
                              (s) => s.idSubject === subject.idSubject
                            )?.distribution["5"] || 0)) /
                            calculateTotalGrades(
                              subjectDistribution.find(
                                (s) => s.idSubject === subject.idSubject
                              )?.distribution || {
                                "2": 0,
                                "3": 0,
                                "4": 0,
                                "5": 0,
                              }
                            )) *
                          100
                        : 0,
                      total: subjectDistribution.find(
                        (s) => s.idSubject === subject.idSubject
                      )
                        ? calculateTotalGrades(
                            subjectDistribution.find(
                              (s) => s.idSubject === subject.idSubject
                            )?.distribution || {
                              "2": 0,
                              "3": 0,
                              "4": 0,
                              "5": 0,
                            }
                          )
                        : 0,
                    }))}
                  columns={[
                    {
                      title: "Предмет",
                      dataIndex: "subject",
                      key: "subject",
                    },
                    {
                      title: "Средний балл",
                      dataIndex: "avgGrade",
                      key: "avgGrade",
                      sorter: (a, b) => a.avgGrade - b.avgGrade,
                      render: (grade) => (
                        <Tag color={getGradeColor(grade)}>
                          {formatAvgGrade(grade)}
                        </Tag>
                      ),
                    },
                    {
                      title: "Качество знаний",
                      dataIndex: "quality",
                      key: "quality",
                      sorter: (a, b) => a.quality - b.quality,
                      render: (quality) => (
                        <Tag
                          color={
                            quality >= 70
                              ? "#52c41a"
                              : quality >= 50
                              ? "#1890ff"
                              : quality >= 30
                              ? "#faad14"
                              : "#f5222d"
                          }
                        >
                          {isNaN(quality) ? "Н/Д" : `${quality.toFixed(1)}%`}
                        </Tag>
                      ),
                    },
                    {
                      title: "Всего оценок",
                      dataIndex: "total",
                      key: "total",
                      sorter: (a, b) => a.total - b.total,
                    },
                  ]}
                  pagination={false}
                  size="middle"
                  className={styles.statistics__table}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24}>
              <Card
                title={
                  <div className={styles.statistics__cardTitle}>
                    <BarChartOutlined /> Средний балл по предметам
                  </div>
                }
                className={styles.statistics__chartCard}
              >
                {subjectAvgGrades.length > 0 ? (
                  chartType === "column" ? (
                    renderBarChart(
                      subjectAvgGrades
                        .filter((subject) => subject.averageGrade > 0)
                        .map((subject) => ({
                          name: subject.subjectName,
                          value: subject.averageGrade,
                          color: getGradeColor(subject.averageGrade),
                        }))
                        .sort((a, b) => b.value - a.value)
                    )
                  ) : chartType === "pie" ? (
                    renderPieChart(
                      subjectAvgGrades
                        .filter((subject) => subject.averageGrade > 0)
                        .map((subject) => ({
                          name: subject.subjectName,
                          value: subject.averageGrade,
                          color: getGradeColor(subject.averageGrade),
                        }))
                    )
                  ) : (
                    renderHorizontalBarChart(
                      subjectAvgGrades
                        .filter((subject) => subject.averageGrade > 0)
                        .map((subject) => ({
                          name: subject.subjectName,
                          value: subject.averageGrade,
                          color: getGradeColor(subject.averageGrade),
                        }))
                        .sort((a, b) => a.value - b.value)
                    )
                  )
                ) : (
                  <Empty description="Нет данных для отображения" />
                )}
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.statistics}>
      <div className={styles.statistics__header}>
        <Title level={2} className={styles.statistics__title}>
          Статистика успеваемости
        </Title>
        <Space>
          <Radio.Group
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className={styles.statistics__chartTypeSelector}
          >
            <Radio.Button value="column">
              <BarChartOutlined /> Столбцы
            </Radio.Button>
            <Radio.Button value="pie">
              <PieChartOutlined /> Круги
            </Radio.Button>
            <Radio.Button value="line">
              <LineChartOutlined /> Линии
            </Radio.Button>
          </Radio.Group>
        </Space>
      </div>

      {loading ? (
        <div className={styles.statistics__loading}>
          <Spin size="large" />
          <Text className={styles.statistics__loadingText}>
            Загрузка статистики...
          </Text>
        </div>
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className={styles.statistics__tabs}
          items={items}
        />
      )}

      <Alert
        message="Информация о статистике"
        description="Статистика рассчитывается на основе всех оценок в системе. Средний балл рассчитывается только для учеников и предметов, у которых есть оценки. Качество знаний - это процент оценок '4' и '5' от общего числа оценок."
        type="info"
        showIcon
        className={styles.statistics__infoAlert}
      />
    </div>
  );
};
