import "./tabs.scss"

type Props = {
  options: { value: string; label: string; count?: number }[]
  activeValue: string
  onChange: (value: string) => void
  variant?: "default" | "small" | "myList"
}

const Tabs = ({ options, activeValue, onChange, variant = "default" }: Props) => {
  return (
    <div className={`tab__buttons ${variant === "myList" ? "tab__buttons--my-list" : ""}`}  role="tablist">
      {options.map(option => (
        <button
          key={option.value}
          className={`text-p tab-option ${variant === "small" ? "tab-option--small" : ""} ${
            activeValue === option.value 
              ? variant === "small" ? "tab-option__selected--small" : "tab-option__selected"
              : "tab-option__unselected"
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {option.count !== undefined && (
            <span className="text-details text-color--75 tab-option__count">{option.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}

export default Tabs