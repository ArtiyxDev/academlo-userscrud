import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
  LuPlus,
} from "react-icons/lu";
import { useState } from "react";

interface TablePagerProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  className?: string;
  onPageChange: (page: number) => void;
  setItemsPerPage?: (itemsPerPage: number) => void;
  onAddUser?: () => void;
}

function TablePager({
  totalItems,
  itemsPerPage,
  currentPage,
  className = "",
  setItemsPerPage,
  onPageChange,
  onAddUser,
}: TablePagerProps) {
  const [selectOpen, setSelectOpen] = useState(false);

  const handleChangePage = (newPage: number) => {
    if (newPage < 1 || newPage > Math.ceil(totalItems / itemsPerPage)) return;
    onPageChange(newPage);
  };

  return (
    <div
      className={`relative my-4 flex items-center justify-center gap-0.5 text-gray-600 ${className}`}
    >
      <button
        className="absolute left-2 flex rounded-md bg-gray-300 p-2 hover:bg-gray-400 dark:hover:bg-gray-700"
        title="Add User"
        onClick={onAddUser}
      >
        <LuPlus size={22} className="text-gray-600" />
        <span>Add User</span>
      </button>
      <div className="relative">
        <select
          name="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage?.(Number(e.target.value));
            setSelectOpen(false);
          }}
          className="appearance-none rounded border border-gray-400 p-1 pr-6"
          onClick={() => setSelectOpen(true)}
          onBlur={() => setSelectOpen(false)}
        >
          <option value={5}>5</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
        </select>
        <span
          className={`pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 transition-transform ${
            selectOpen ? "rotate-180" : ""
          }`}
        >
          <LuChevronDown />
        </span>
      </div>
      <LuChevronsLeft onClick={() => handleChangePage(1)} />
      <LuChevronLeft onClick={() => handleChangePage(currentPage - 1)} />
      <span className="size-8 rounded-md bg-gray-200 text-center text-xl font-semibold">
        {currentPage}
      </span>
      <LuChevronRight onClick={() => handleChangePage(currentPage + 1)} />
      <LuChevronsRight
        onClick={() => handleChangePage(Math.ceil(totalItems / itemsPerPage))}
      />
    </div>
  );
}

export default TablePager;
