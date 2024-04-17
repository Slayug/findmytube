import {forwardRef, InputHTMLAttributes, Ref} from "react";

import styles from './Input.module.scss'

type InputProps = {
  loading?: boolean
} & InputHTMLAttributes<HTMLInputElement>


const Input = forwardRef((props: InputProps, ref: Ref<HTMLInputElement>) => {

  const { loading, ...inputProps } = props;

  return <>
    <input
      ref={ref}
      {...inputProps}
      className={`px-3 border-2 border-white rounded-t-lg min-h-10 ${styles.input}
                  focus:border-white focus:shadow hover:drop-shadow-md ${inputProps.className}`}
    />
    {loading && <span>loading..</span>}
  </>

});

export default Input;
