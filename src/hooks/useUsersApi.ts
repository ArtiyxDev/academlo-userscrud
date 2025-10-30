import { useState, useCallback, useEffect, useMemo } from "react";
import axios, { type AxiosInstance, AxiosError } from "axios";
import type {
  UseUsersApiReturn,
  JsonUser,
  CreateUser,
  ApiConfig,
  ApiResponse,
} from "../types/api";

/**
 * Custom React hook for managing users via REST API.
 * Connects to the academlo-usersapi backend for full CRUD operations.
 *
 * @returns {UseUsersApiReturn} Object containing user data, loading/error states, and API methods.
 */

// API Base URL - Update this to match your API deployment
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const useUsersApi = (): UseUsersApiReturn => {
  const [users, setUsers] = useState<JsonUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Configure axios instance for REST API
  const apiClient: AxiosInstance = useMemo(() => {
    const config: ApiConfig = {
      baseUrl: API_BASE_URL,
      timeout: 10000,
    };

    return axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, []);

  /**
   * Centralized error handling for API operations.
   * Processes both axios errors and custom errors consistently.
   */
  const handleApiError = useCallback((error: unknown, operation: string) => {
    let errorMessage = `Failed to ${operation}`;

    if (error instanceof AxiosError) {
      if (error.response) {
        const data = error.response.data as { message?: string };
        errorMessage =
          data.message ||
          `HTTP ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage =
          "Network error - unable to reach server. Make sure the API is running.";
      } else {
        errorMessage = error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    setError(errorMessage);
    console.error(`API Error - ${operation}:`, error);
  }, []);

  /**
   * Generic API request wrapper with loading states and error handling.
   * Provides consistent UX and error management across all operations.
   */
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

  /**
   * Fetches all users from the API.
   * GET /api/v1/users
   */
  const getUsers = useCallback(async (): Promise<JsonUser[]> => {
    return makeApiRequest(async () => {
      const response = await apiClient.get<ApiResponse<JsonUser[]>>("/users");

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch users");
      }

      const fetchedUsers = response.data.data;
      setUsers(fetchedUsers);
      return fetchedUsers;
    }, "fetch users");
  }, [apiClient, makeApiRequest]);

  /**
   * Creates a new user via API.
   * POST /api/v1/users
   */
  const createUser = useCallback(
    async (user: CreateUser): Promise<JsonUser> => {
      return makeApiRequest(async () => {
        // Client-side validation
        if (
          !user.firstName.trim() ||
          !user.lastName.trim() ||
          !user.email.trim()
        ) {
          throw new Error(
            "First name, last name and email are required fields",
          );
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
          throw new Error("Please provide a valid email address");
        }

        if (!user.password || user.password.length < 8) {
          throw new Error("Password must be at least 8 characters long");
        }

        const response = await apiClient.post<ApiResponse<JsonUser>>(
          "/users",
          user,
        );

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to create user");
        }

        const newUser = response.data.data;
        setUsers((prevUsers) => [...prevUsers, newUser]);

        return newUser;
      }, "create user");
    },
    [apiClient, makeApiRequest],
  );

  /**
   * Updates an existing user via API.
   * PUT /api/v1/users/:id
   */
  const updateUser = useCallback(
    async (id: number, userUpdate: Partial<CreateUser>): Promise<JsonUser> => {
      return makeApiRequest(async () => {
        // Client-side validation
        if (
          userUpdate.email &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userUpdate.email)
        ) {
          throw new Error("Please provide a valid email address");
        }

        if (userUpdate.password && userUpdate.password.length < 8) {
          throw new Error("Password must be at least 8 characters long");
        }

        const response = await apiClient.put<ApiResponse<JsonUser>>(
          `/users/${id}`,
          userUpdate,
        );

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to update user");
        }

        const updatedUser = response.data.data;
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === id ? updatedUser : u)),
        );

        return updatedUser;
      }, "update user");
    },
    [apiClient, makeApiRequest],
  );

  /**
   * Deletes a user via API.
   * DELETE /api/v1/users/:id
   */
  const deleteUser = useCallback(
    async (userId: number): Promise<void> => {
      return makeApiRequest(async () => {
        const response = await apiClient.delete<ApiResponse<{ id: number }>>(
          `/users/${userId}`,
        );

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to delete user");
        }

        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
      }, "delete user");
    },
    [apiClient, makeApiRequest],
  );

  /**
   * Refreshes user data by re-fetching from API.
   */
  const refreshUsers = useCallback(async (): Promise<void> => {
    await getUsers();
  }, [getUsers]);

  // Load users when component mounts
  useEffect(() => {
    getUsers().catch((error) =>
      console.error("Failed to fetch users on mount:", error),
    );
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

export default useUsersApi;
