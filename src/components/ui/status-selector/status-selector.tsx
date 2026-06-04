
import { formatStatus } from "../../../utils/format-status";
import "./status-selector.scss"

type Props = {
  value: string;
  onChange: (value: string) => void;
  id:string;
}

const statusList = ["watching", "completed", "dropped", "planToWatch"]

const StatusSelector = ({ value, onChange, id }: Props) => {
  return (
    <div className="status-selector" id={id}>
      {statusList.map(status => (
        <button
          key={status}
          type="button" // importante para que no haga submit
          className={`btn btn--secondary status-selector__btn ${value === status ? "status-selector__btn--active" : ""}`}
          onClick={() => onChange(status)}
        >
          {formatStatus(status)}
        </button>
      ))}
    </div>
  )
}

export default StatusSelector