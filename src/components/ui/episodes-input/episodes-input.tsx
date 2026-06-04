import "./episodes-input.scss";

type Props = {
  value: number;
  onChange: (value: number) => void;
  max: number;
  id:string;
};

const EpisodesInput = ({ value, onChange, max, id }: Props) => {
  return (
    <div className="episodes--wrapper">
        <div>
        <button type="button" className="btn btn--secondary btn--episodes-input btn-left" onClick={() => onChange(Math.max(1, value - 1))}>
          -
        </button>
        <input
          id={id}
          className="text-p input input--episodes"
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={1}
          max={max}
        />
        <button
          type="button"
          className="btn  btn--episodes-input btn-right"
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </button>
        </div>
        <p className="text-details text-color--75">{value}</p>
    </div>
  );
};

export default EpisodesInput;
