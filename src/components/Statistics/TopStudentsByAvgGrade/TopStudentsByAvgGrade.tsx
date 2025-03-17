import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { getTopStudents } from "../../../api/api-utils";
import { TopStudent } from "../../../types";
import styles from "./TopStudentsByAvgGrade.module.scss";
import { Link } from "react-router-dom";

export const TopStudentsByAvgGrade: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopStudents = async () => {
      try {
        if (user.accessToken) {
          const students = await getTopStudents(user.accessToken);
          setTopStudents(students);
        }
      } catch (err) {
        console.error("Failed to fetch top students:", err);
        setError("Failed to load top students data");
      } finally {
        setLoading(false);
      }
    };

    fetchTopStudents();
  }, [user.accessToken]);

  return (
    <div className={styles.topStudents}>
      <div className={styles.topStudents__header}>
        <h3>Top Students by Average Grade</h3>
      </div>

      {loading && (
        <div className={styles.topStudents__loading}>
          <div className={styles.topStudents__loadingSpinner}></div>
          <p>Loading top students...</p>
        </div>
      )}

      {error && (
        <div className={styles.topStudents__error}>
          <p className={styles.topStudents__errorMessage}>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.topStudents__list}>
          {topStudents.length > 0 ? (
            <ul className={styles.topStudents__items}>
              {topStudents.map((student) => (
                <li
                  key={student.rankingPosition}
                  className={styles.topStudents__card}
                >
                  <Link to={`/profile/${student.uid}`} className={styles.topStudents__link}>
                    <div className={styles.topStudents__rank}>
                      {student.rankingPosition}
                    </div>
                    <div className={styles.topStudents__info}>
                      <div className={styles.topStudents__name}>
                        {student.firstName} {student.lastName}
                      </div>
                      <div className={styles.topStudents__grade}>
                        <span className={styles.topStudents__gradeLabel}>
                          Average Grade:
                        </span>
                        <span className={styles.topStudents__gradeValue}>
                          {student.averageGrade}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.topStudents__noData}>
              <p>No top students data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
