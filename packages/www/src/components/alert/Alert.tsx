import { ReactNode} from "react";

export default function Alert({message, type, children}: {
  message?: string,
  type: 'warning' | 'success' | 'danger' | 'info',
  children?: ReactNode
}) {


  return <section>{message ? message : children} - {type}</section>

}
