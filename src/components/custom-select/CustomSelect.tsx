import { useEffect, useRef, useState } from "react";
import "./customSelect.scss"

type Props = {
  options:string[],
  value:string,
  onChange: (option:string) => void,
}

const CustomSelect = ({ options, value, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <div className="custom-select" ref={selectorRef}>
        <button className="custom-select__trigger selector" onClick={() => setIsOpen(!isOpen)}>
          {value}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--color-white-50)" className="size-6 icon-size-m">
            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
          </svg>
        </button>
      {isOpen && (
          <ul className="popover-panel custom-select__dropdown">
            {options.map(option => (
              <li
                key={option}
                className={`custom-select__option ${value === option ? "custom-select__option--active" : ""}`}
                onClick={() => { onChange(option); setIsOpen(false) }}
              >
                {option}
              </li>
            ))}
          </ul>
      )}
      </div>
    </>
  );
};

export default CustomSelect;
