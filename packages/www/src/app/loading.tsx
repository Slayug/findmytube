import styles from './loading.module.scss'

export default function AppLoading({ message }: { message?: string}) {
  return <div className={styles.loading}>
    <div className={styles.background}>/</div>
    <p>{message ? message : `Loading..`}</p>
  </div>
}
