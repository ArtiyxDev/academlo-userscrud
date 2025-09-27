import { UserCard } from ".";
import type { JsonUser } from "../types/api";
interface UsersTableProps {
  searchText: string;
  loading: boolean;
  error: string | null;
  data: JsonUser[];
  itemsPerPage?: number;
  page?: number;
  className?: string;
  onEditUser?: (user: JsonUser) => void;
  onDeleteUser?: (userId: string) => void;
}

function UsersTable({
  searchText,
  loading,
  error,
  data,
  itemsPerPage = 10,
  page = 1,
  className,
  onEditUser,
  onDeleteUser,
}: UsersTableProps) {
  return (
    <div className={`grid w-full gap-3 ${className}`}>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : data.length === 0 ? (
        <p>No users found.</p>
      ) : (
        data
          .filter((user) => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            return (
              fullName.includes(searchText.toLowerCase()) ||
              user.email.toLowerCase().includes(searchText.toLowerCase())
            );
          })
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={onEditUser}
              onDelete={onDeleteUser}
            />
          ))
      )}
    </div>
  );
}

export default UsersTable;
