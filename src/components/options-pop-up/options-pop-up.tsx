import { useEffect, useRef } from "react";
import "./options-pop-up.scss"
import IconTrash from "../ui/icons/icon-trash";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
};

const OptionsPopUp = ({ isOpen, onClose, onDelete }: Props) => {
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
  
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
  
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])
  
  return(
    <div className="surface container--option-delete" ref={optionsRef}>
      <button className="action-item text-p option--items" onClick={onDelete}>
        <IconTrash className="size-6 action-item__icon"/>
        Remove anime from list
      </button>
    </div>
  )
};

export default OptionsPopUp
