import { useEffect, useRef, useState } from "react";
import "./custom-select.scss"

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
    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)  // ✅
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown) 
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)     // ✅
    }
  }, [])

  return (
      <div className="custom-select" ref={selectorRef}>
        <button className="text-p custom-select__trigger selector" onClick={() => setIsOpen(!isOpen)} style={{ width: containerWidth}} aria-haspopup="listbox"
          aria-expanded={isOpen}>
          {value || firstValue}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white-50)" className="size-6 icon-size-m">
            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
          </svg>
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
