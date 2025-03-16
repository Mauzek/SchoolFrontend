import { useSelector} from "react-redux";
import { RootState } from "../../store";
import styles from "./Home.module.scss";

export const Home = () => {
    const user = useSelector((state: RootState) => state.user);
    console.log(user);
  return (
    <main className={styles.home}>
        <h1>Home</h1>
        <h2>{user.user.firstName}</h2>
    </main>
  )
}
