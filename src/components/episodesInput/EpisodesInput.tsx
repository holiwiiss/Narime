import "./episodesInput.scss";

type Props = {
  value: number;
  onChange: (value: number) => void;
  max: number;
};

const EpisodesInput = ({ value, onChange, max }: Props) => {
  return (
    <div className="episodes--wrapper">
        <div>
        <button type="button" className="btn btn--secondary btn--episodes-input btn-left" onClick={() => onChange(Math.max(1, value - 1))}>
          -
        </button>
        <input
          className="text-p input--episodes"
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
