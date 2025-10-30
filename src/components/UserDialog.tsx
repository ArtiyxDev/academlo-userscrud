import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Card from "./Card";
import Dialog from "./Dialog";
import type { JsonUser, CreateUser } from "../types/api";
import useUsersApi from "../hooks/useUsersApi";

interface UserDialogProps {
  user?: JsonUser | null;
  mode?: "edit" | "create";
  isOpen: boolean;
  onClose?: () => void;
  onUserSaved?: () => void;
}

function UserDialog({
  user,
  mode = "create",
  isOpen,
  onClose,
  onUserSaved,
}: UserDialogProps) {
  const { createUser, updateUser, loading } = useUsersApi();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CreateUser>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      birthday: "",
      avatarUrl: "",
    },
  });

  // Resetear el formulario cuando cambie el usuario o el modo
  useEffect(() => {
    if (user && mode === "edit") {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: "", // No prellenar password en modo edición
        birthday: user.birthday,
        avatarUrl: user.avatarUrl || "",
      });
    } else if (mode === "create") {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        birthday: "",
        avatarUrl: "",
      });
    }
  }, [user, mode, reset]);

  const onSubmit = async (data: CreateUser) => {
    try {
      if (mode === "edit" && user) {
        await updateUser(user.id, data);
      } else {
        await createUser(data);
      }
      reset();
      onUserSaved?.(); // Notificar que se guardó el usuario
      onClose?.(); // Cerrar el dialog
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <Card className="dark:bg-gray-800">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-80 space-y-4 p-4 dark:text-white"
        >
          <h2 className="mb-4 w-full text-center text-2xl font-bold">
            {mode === "edit" ? "Edit User" : "Create New User"}
          </h2>

          <fieldset className="m-0">
            <label htmlFor="firstName">
              First Name<span className="font-bold text-red-500">*</span>
            </label>
            <input
              {...register("firstName", { required: "First name is required" })}
              className="w-full rounded border border-gray-400 p-2 transition-colors duration-200 focus:border-blue-500"
            />
            {errors.firstName && (
              <span className="text-sm text-red-500">
                {errors.firstName.message}
              </span>
            )}
          </fieldset>

          <fieldset className="m-0">
            <label htmlFor="lastName">
              Last Name<span className="font-bold text-red-500">*</span>
            </label>
            <input
              {...register("lastName", { required: "Last name is required" })}
              className="w-full rounded border border-gray-400 p-2 transition-colors duration-200 focus:border-blue-500"
            />
            {errors.lastName && (
              <span className="text-sm text-red-500">
                {errors.lastName.message}
              </span>
            )}
          </fieldset>

          <fieldset className="m-0">
            <label htmlFor="email">
              Email<span className="font-bold text-red-500">*</span>
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              })}
              type="email"
              className="w-full rounded border border-gray-400 p-2 transition-colors duration-200 focus:border-blue-500"
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </fieldset>

          <fieldset className="m-0">
            <label htmlFor="password">
              Password
              {mode === "create" && (
                <span className="font-bold text-red-500">*</span>
              )}
            </label>
            <input
              {...register("password", {
                required: mode === "create" ? "Password is required" : false,
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              type="password"
              placeholder={mode === "edit" ? "Leave empty to keep current" : ""}
              className="w-full rounded border border-gray-400 p-2 transition-colors duration-200 focus:border-blue-500"
            />
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </fieldset>

          <fieldset className="m-0">
            <label htmlFor="birthday">
              Birthday<span className="font-bold text-red-500">*</span>
            </label>
            <input
              {...register("birthday", { required: "Birthday is required" })}
              type="date"
              className="w-full rounded border border-gray-400 p-2 transition-colors duration-200 focus:border-blue-500"
            />
            {errors.birthday && (
              <span className="text-sm text-red-500">
                {errors.birthday.message}
              </span>
            )}
          </fieldset>

          <fieldset className="m-0">
            <label htmlFor="avatarUrl">Avatar URL</label>
            <input
              {...register("avatarUrl")}
              type="url"
              className="w-full rounded border border-gray-400 p-2 transition-colors duration-200 focus:border-blue-500"
            />
          </fieldset>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-blue-500 px-4 py-2 text-white shadow transition-colors duration-200 hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : mode === "edit" ? "Update" : "Create"}
            </button>
            <button
              type="button"
              className="w-full rounded bg-gray-500 px-4 py-2 text-white shadow transition-colors duration-200 hover:bg-gray-600"
              onClick={() => {
                reset();
                onClose?.();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </Dialog>
  );
}

export default UserDialog;
