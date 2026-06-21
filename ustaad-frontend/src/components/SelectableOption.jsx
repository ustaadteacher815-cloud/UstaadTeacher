function SelectableOption({ selected, onSelect, children, className = "" }) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`ustaad-option${selected ? " selected" : ""} ${className}`.trim()}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {children}
    </div>
  );
}

export default SelectableOption;
