import React from 'react';
import { StudentDetails } from '../../../types';
import { ProfileHeader } from '../ProfileHeader/ProfileHeader';
import styles from './StudentProfile.module.scss';
import { PieChart } from '@mui/x-charts/PieChart';

interface StudentProfileProps {
  profile: StudentDetails;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ profile }) => {
  const { student, class: studentClass, parents, distribution } = profile;
  const fullName = `${student.lastName} ${student.firstName} ${student.middleName || ''}`;
  
  const headerDetails = [
    `Class: ${studentClass.number}${studentClass.letter}`,
    `Email: ${student.email}`,
    `Phone: ${student.phone}`
  ];

  const pieChartData = Object.entries(distribution).map(([grade, count]) => ({
    id: grade,
    value: Number(count),
    label: grade
  }));

  // Calculate total grades for percentage display
  const totalGrades = pieChartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className={styles.profile}>
      <h1 className={styles.profile__title}>Student Profile</h1>
      
      <div className={styles.profile__content}>
        <ProfileHeader 
          photo={student.photo} 
          name={fullName} 
          details={headerDetails} 
          photoAlt="Student"
        />
        
        <div className={styles.profile__details}>
          <h3>Personal Information</h3>
          <div className={styles.profile__detailsGrid}>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Birth Date:</span>
              <span>{new Date(student.birthDate).toLocaleDateString()}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Gender:</span>
              <span>{student.gender}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Document Number:</span>
              <span>{student.documentNumber}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Blood Group:</span>
              <span>{student.bloodGroup}</span>
            </div>
          </div>
          
          <h3>Parents</h3>
          <div className={styles.profile__parentsList}>
            {parents.map((parent) => (
              <div key={parent.id} className={styles.profile__parentItem}>
                {`${parent.lastName} ${parent.firstName} ${parent.middleName || ''}`}
              </div>
            ))}
          </div>
          
          <h3>Grade Distribution</h3>
          <div className={styles.profile__gradeSection}>
            <div className={styles.profile__gradesChart}>
              <PieChart
                series={[
                  {
                    data: pieChartData,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    innerRadius: 30,
                    paddingAngle: 2,
                    cornerRadius: 5,
                    startAngle: -90,
                    endAngle: 270,
                  }
                ]}
                width={400}
                height={300}
                margin={{ top: 10, bottom: 50, left: 10, right: 10 }}
                slotProps={{
                  legend: {
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'middle' },
                    padding: 0,
                  },
                }}
              />
            </div>
            
            <div className={styles.profile__gradesDetails}>
              <h4 className={styles.profile__gradesTitle}>Grade Breakdown</h4>
              <div className={styles.profile__gradesGrid}>
                {Object.entries(distribution).map(([grade, count]) => {
                  const percentage = totalGrades > 0 ? ((Number(count) / totalGrades) * 100).toFixed(1) : '0';
                  return (
                    <div key={grade} className={styles.profile__gradeItem}>
                      <div className={styles.profile__gradeHeader}>
                        <span className={styles.profile__grade}>{grade}</span>
                        <span className={styles.profile__count}>{count}</span>
                      </div>
                      <div className={styles.profile__gradeBar}>
                        <div 
                          className={styles.profile__gradeFill} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className={styles.profile__gradePercentage}>{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
