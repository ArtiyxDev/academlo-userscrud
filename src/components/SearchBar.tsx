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
    <div
      className={`my-3 flex w-2/3 rounded bg-white p-2 shadow transition-colors duration-200 lg:w-1/3 dark:bg-gray-800 ${className}`}
    >
      <input
        type="text"
        placeholder="Search users..."
        className="flex-1 border-none bg-transparent text-gray-900 outline-none placeholder:text-gray-500 dark:text-gray-100"
        value={filterText}
        onChange={(e) => onFilterTextChange?.(e.target.value)}
      />
      <LuSearch className="size-5 text-gray-500 dark:text-gray-400" />
    </div>
  );
}

export default SearchBar;
