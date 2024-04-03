import Input from "../input/Input";
import {DetailedHTMLProps, forwardRef, InputHTMLAttributes} from "react";


export default function
SearchInput({ ...props}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {

  return <Input {...props} />
}
