
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
          data-status={status}
          key={status}
          type="button"
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