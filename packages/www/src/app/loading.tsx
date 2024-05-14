import styles from './loading.module.scss'
import {ReactNode} from "react";

export default function AppLoading({ message }: { message?: string | ReactNode }) {
  return <div className={styles.loading}>
    <div className={styles.background}>/</div>
    <p>{message ? message : `Loading..`}</p>
  </div>
}
