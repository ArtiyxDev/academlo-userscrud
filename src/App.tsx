import { useEffect, useState } from "react";
import { Header, SearchBar, TablePager, UsersTable } from "./components";
import { initTheme } from "./utils/toggleDarkTheme";
import useJsonApi from "./hooks/useJsonApi";

import "./App.css";
import UserDialog from "./components/UserDialog";
import type { JsonUser } from "./types/api";

function App() {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const { users, loading, error, deleteUser, refreshUsers } = useJsonApi();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<JsonUser | null>(null);
  useEffect(() => {
    initTheme();
  }, []);

  return (
    <>
      <Header />
      <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
      <UsersTable
        searchText={filterText}
        loading={loading}
        data={users}
        error={error}
        itemsPerPage={itemsPerPage}
        page={currentPage}
        className="px-2"
        onEditUser={(user) => {
          setDialogMode("edit");
          setIsDialogOpen(true);
          setSelectedUser(user);
        }}
        onDeleteUser={async (userId) => {
          await deleteUser(userId);
        }}
      />
      <TablePager
        totalItems={users.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        setItemsPerPage={setItemsPerPage}
        className="w-full justify-end pe-3"
        onAddUser={() => {
          setDialogMode("create");
          setIsDialogOpen(true);
        }}
      />
      <UserDialog
        isOpen={isDialogOpen}
        user={dialogMode === "edit" ? selectedUser : null}
        mode={dialogMode}
        onClose={() => {
          setIsDialogOpen(false);
        }}
        onUserSaved={() => {
          refreshUsers();
        }}
      />
    </>
  );
}

export default App;
