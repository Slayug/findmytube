import {ButtonHTMLAttributes, ReactNode} from "react";


export default function Button({ children, ...otherProps }: { children : ReactNode} & ButtonHTMLAttributes<any>) {


  return <button {...otherProps} className="py-2 px-3 border rounded-lg focus:border-white focus:shadow hover:drop-shadow-md bg-gray-50 hover:bg-red-50">
    { children }
  </button>
}
