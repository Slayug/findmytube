import { ReactNode} from "react";

import styles from './Alert.module.scss'

export default function Alert({message, type, children, isLoading}: {
  message?: string,
  type: 'warning' | 'success' | 'danger' | 'info',
  children?: ReactNode,
  isLoading?: boolean
}) {

  return <div className="flex justify-center flex-col items-center text-xl font-semibold italic text-center text-slate-900">
    <p className="text-violet-600 p-1 relative">{ message ? message : children}</p>
    {isLoading && <div className={styles.loading}></div>}
  </div>


}
