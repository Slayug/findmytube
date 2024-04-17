import {ButtonHTMLAttributes, ReactNode} from "react";

import styles from './Button.module.scss'

export default function Button({ children, ...otherProps }: { children : ReactNode} & ButtonHTMLAttributes<any>) {

  return <button {...otherProps}
    className={`py-2 px-3 rounded-lg 
              ${otherProps.className} ${styles.button}`}>
    { children }
  </button>
}
