import type { JsonUser } from "../types/api";
import Card from "./Card";
import { LuPencil, LuTrash2, LuCalendar, LuMail } from "react-icons/lu";

interface UserCardProps {
  user: JsonUser;
  className?: string;
  onEdit?: (user: JsonUser) => void;
  onDelete?: (userId: string) => void;
}

function UserCard({ user, className, onEdit, onDelete }: UserCardProps) {
  const formatBirthDate = (birthDate: string) => {
    try {
      const date = new Date(birthDate);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return birthDate;
    }
  };

  const handleEdit = () => {
    onEdit?.(user);
  };

  const handleDelete = () => {
    onDelete?.(user.id);
  };

  return (
    <Card
      className={`rounded-lg border border-gray-200 p-5 shadow-md transition-all duration-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      <div className="flex flex-col space-y-3">
        {/* Header con nombre y botones */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h3>
          </div>
        </div>

        {/* Información del usuario */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <LuMail size={16} className="text-gray-400" />
            <span className="text-sm">{user.email}</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <LuCalendar size={16} className="text-gray-400" />
            <span className="text-sm">{formatBirthDate(user.birthDate)}</span>
          </div>
        </div>
        {/* Botones de acción */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleEdit}
            className="rounded-md bg-blue-500 p-2 text-white transition-colors duration-150 hover:bg-sky-600 dark:bg-sky-400 dark:hover:bg-sky-500"
            title="Editar usuario"
          >
            <LuPencil size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="rounded-md bg-red-500 p-2 text-white transition-colors duration-150 hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500"
            title="Eliminar usuario"
          >
            <LuTrash2 size={12} />
          </button>
        </div>
      </div>
    </Card>
  );
}

export default UserCard;
