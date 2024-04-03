import {forwardRef, InputHTMLAttributes, Ref} from "react";

type InputProps = {
  loading?: boolean
} & InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef((props: InputProps, ref: Ref<HTMLInputElement>) => {

  return <>
    <input
      ref={ref}
      className="py-2 px-3 border rounded-lg focus:border-white focus:shadow hover:drop-shadow-md"
      {...props}
    />
    {props.loading && <span>loading..</span>}
  </>

});

export default Input;
