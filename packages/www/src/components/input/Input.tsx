import {forwardRef, InputHTMLAttributes, Ref} from "react";

type InputProps = {
  loading?: boolean
} & InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef((props: InputProps, ref: Ref<HTMLInputElement>) => {

  const { loading, ...inputProps } = props;

  return <>
    <input
      ref={ref}
      {...inputProps}
      className={`px-3 border border-white rounded-lg
                  focus:border-white focus:shadow hover:drop-shadow-md ${inputProps.className}`}
    />
    {loading && <span>loading..</span>}
  </>

});

export default Input;
