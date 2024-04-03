import {forwardRef, InputHTMLAttributes, Ref} from "react";

const Input = forwardRef((props: InputHTMLAttributes<HTMLInputElement>, ref: Ref<HTMLInputElement>) => {

  console.log(props);

  return <input
    ref={ref}
    className="py-2 px-3 border rounded-lg focus:border-white focus:shadow hover:drop-shadow-md"
    {...props}
  />

});

export default Input;
