import { useEffect, useRef, useState } from "react";
import "./custom-select.scss"
import IconChevronDown from "../ui/icons/icon-chevron-down";

type Props = {
  options: string[],
  value:string,
  onChange: (option:string) => void,
  onReset?: () => void,
  containerWidth? : string,
  firstValue? : string,
}

const CustomSelect = ({ options, value, onChange, onReset, containerWidth, firstValue, }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return 

    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown) 
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="custom-select" ref={selectorRef}>
      <button className="text-p custom-select__trigger selector" onClick={() => setIsOpen(!isOpen)} style={{ width: containerWidth}} aria-haspopup="listbox"
        aria-expanded={isOpen}>
        {value || firstValue}
        <IconChevronDown className="size-6 icon-size-m"/>
      </button>
      {isOpen && (
        <ul className="surface custom-select__dropdown" role="listbox">
          {onReset && value && (
            <li
              className="text-p text-color-75 custom-select__option custom-select__option--reset"
              onClick={() => { onReset(); setIsOpen(false) }}
            >
              ✕ Clear
            </li>
          )}

          {options.map((option:string) => (
            <li
              role="option"
              aria-selected={value === option}
              key={option}
              className={`text-p text-color-75 custom-select__option ${value === option ? "custom-select__option--active" : ""}`}
              onClick={() => { onChange(option); setIsOpen(false) }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
