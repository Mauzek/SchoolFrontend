import styles from "./Home.module.scss";
import { TopStudentsByAvgGrade } from "../../components/Statistics/TopStudentsByAvgGrade/TopStudentsByAvgGrade";
import { Clock } from "../../components/Clock/Clock";
import { NewsSection } from "../../components/News/NewsSection";

export const Home = () => {
  return (
    <main className={styles.home}>
      
      <div className={styles.contentContainer}>
        <section className={styles.newsContainer}>
          <NewsSection />
        </section>
        
        <section className={styles.dashboardContainer}>
          <Clock/>
          <TopStudentsByAvgGrade />
          {/* You can add more dashboard components here */}
        </section>
      </div>
    </main>
  );
};
