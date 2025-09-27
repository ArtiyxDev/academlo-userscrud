import { LuSearch } from "react-icons/lu";

interface SearchBarProps {
  filterText?: string;
  onFilterTextChange?: (text: string) => void;
  className?: string;
}

function SearchBar({
  filterText,
  onFilterTextChange,
  className = "",
}: SearchBarProps) {
  return (
    <div className={`my-3 flex w-2/3 rounded bg-white p-2 shadow ${className}`}>
      <input
        type="text"
        placeholder="Search users..."
        className="flex-1 border-none outline-none"
        value={filterText}
        onChange={(e) => onFilterTextChange?.(e.target.value)}
      />
      <LuSearch className="size-5 text-gray-500" />
    </div>
  );
}

export default SearchBar;
