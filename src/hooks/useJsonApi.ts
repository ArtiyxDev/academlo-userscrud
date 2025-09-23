import { useState, useCallback, useMemo } from "react";

interface JsonUser {
  id?: string;
  name: string;
  email: string;
  birthDate: string;
  avatarUrl?: string;
}

type CreateUser = Omit<JsonUser, "id">;

interface ApiHeaders {
  "Content-Type": string;
  "X-Master-Key": string;
  [key: string]: string;
}

interface UseJsonApiReturn {
  users: JsonUser[];
  loading: boolean;
  error: string | null;
  getUsers: () => Promise<JsonUser[]>;
  createUser: (user: CreateUser) => Promise<JsonUser>;
  updateUser: (id: string, user: Partial<JsonUser>) => Promise<JsonUser>;
  deleteUser: (userId: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const useJsonApi = (): UseJsonApiReturn => {
  const [users, setUsers] = useState<JsonUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize configuration to prevent recreation on every render
  const config = useMemo(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const apiKey = import.meta.env.VITE_API_KEY;

    if (!apiUrl || !apiKey) {
      throw new Error(
        "API URL or API Key is not defined in environment variables",
      );
    }

    const headers: ApiHeaders = {
      "Content-Type": "application/json",
      "X-Master-Key": apiKey,
    };

    return { apiUrl, headers };
  }, []);

  // Centralized error handling
  const handleApiError = useCallback((error: unknown, operation: string) => {
    const errorMessage =
      error instanceof Error ? error.message : `Failed to ${operation}`;
    setError(errorMessage);
    console.error(`API Error - ${operation}:`, error);
    throw new Error(errorMessage);
  }, []);

  // Generic API request handler with loading states
  const makeApiRequest = useCallback(
    async <T>(requestFn: () => Promise<T>, operation: string): Promise<T> => {
      try {
        setLoading(true);
        setError(null);
        const result = await requestFn();
        return result;
      } catch (error) {
        handleApiError(error, operation);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [handleApiError],
  );

  const getUsers = useCallback(async (): Promise<JsonUser[]> => {
    return makeApiRequest(async () => {
      const response = await fetch(`${config.apiUrl}/b`, {
        method: "GET",
        headers: config.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data);
      return data;
    }, "fetch users");
  }, [config, makeApiRequest]);

  const createUser = useCallback(
    async (user: CreateUser): Promise<JsonUser> => {
      return makeApiRequest(async () => {
        const response = await fetch(`${config.apiUrl}/b`, {
          method: "POST",
          headers: config.headers,
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const newUser = await response.json();
        setUsers((prev) => [...prev, newUser]);
        return newUser;
      }, "create user");
    },
    [config, makeApiRequest],
  );

  const updateUser = useCallback(
    async (id: string, user: Partial<JsonUser>): Promise<JsonUser> => {
      return makeApiRequest(async () => {
        const response = await fetch(`${config.apiUrl}/b/${id}`, {
          method: "PATCH",
          headers: config.headers,
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const updatedUser = await response.json();
        setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));
        return updatedUser;
      }, "update user");
    },
    [config, makeApiRequest],
  );

  const deleteUser = useCallback(
    async (userId: string): Promise<void> => {
      return makeApiRequest(async () => {
        const response = await fetch(`${config.apiUrl}/b/${userId}`, {
          method: "DELETE",
          headers: config.headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }, "delete user");
    },
    [config, makeApiRequest],
  );

  const refreshUsers = useCallback(async (): Promise<void> => {
    await getUsers();
  }, [getUsers]);

  return {
    users,
    loading,
    error,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers,
  };
};

export default useJsonApi;
