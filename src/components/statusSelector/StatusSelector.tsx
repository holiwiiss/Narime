import { formatStatus } from "../../utils/formatStatus";
import "./statusSelector.scss"
type Props = {
  value: string;
  onChange: (value: string) => void;
}

const statusList = ["watching", "completed", "dropped", "planToWatch"]

const StatusSelector = ({ value, onChange }: Props) => {
  return (
    <div className="status-selector">
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