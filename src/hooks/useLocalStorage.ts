import { useState, useCallback, useEffect, useMemo } from "react";
import axios, { type AxiosInstance, AxiosError } from "axios";
import type {
  UseJsonApiReturn,
  JsonUser,
  CreateUser,
  ApiConfig,
} from "../types/api";

/**
 * Custom React hook for managing users via simulated JSON API with axios.
 * Combines JSON file data with localStorage for persistence, simulating real API behavior.
 *
 * @returns {UseJsonApiReturn} Object containing user data, loading/error states, and API methods.
 */

// Constants for localStorage and API simulation
const STORAGE_KEY = "users-crud-modifications";
const API_DELAY = 500; // Simulate network delay (ms)

/**
 * Generates a unique ID for new users using timestamp and random number.
 * Ensures uniqueness across sessions and simulates database auto-increment.
 */
const generateUniqueId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Adds artificial delay to simulate real API response times.
 * Makes the app feel more realistic during development.
 */
const simulateApiDelay = async (delay: number = API_DELAY): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Loads user modifications from localStorage.
 * These are changes made after the initial JSON load (creates, updates, deletes).
 */
const getStoredModifications = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : { created: [], updated: {}, deleted: [] };
  } catch (error) {
    console.error("Error loading modifications from localStorage:", error);
    return { created: [], updated: {}, deleted: [] };
  }
};

/**
 * Saves user modifications to localStorage.
 * Maintains separate tracking of creates, updates, and deletes.
 */
const saveModifications = (modifications: {
  created: JsonUser[];
  updated: Record<string, Partial<JsonUser>>;
  deleted: string[];
}): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modifications));
  } catch (error) {
    console.error("Error saving modifications to localStorage:", error);
  }
};

const useJsonApi = (): UseJsonApiReturn => {
  const [users, setUsers] = useState<JsonUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Configure axios instance with simulated API settings
  const apiClient: AxiosInstance = useMemo(() => {
    const config: ApiConfig = {
      baseUrl: "/api", // Points to public/api folder
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
        errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "Network error - unable to reach server";
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
    async <T>(
      requestFn: () => Promise<T>,
      operation: string,
      includeDelay: boolean = true,
    ): Promise<T> => {
      try {
        setLoading(true);
        setError(null);

        // Simulate network delay for realism
        if (includeDelay) {
          await simulateApiDelay();
        }

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
   * Merges base JSON data with localStorage modifications.
   * Creates the final user list combining original data with CRUD operations.
   */
  const mergeUsersWithModifications = useCallback(
    (baseUsers: JsonUser[]): JsonUser[] => {
      const modifications = getStoredModifications();

      // Start with base users, apply updates, filter deletes
      let mergedUsers = baseUsers
        .map((user) => {
          const updatedData = modifications.updated[user.id];
          return updatedData ? { ...user, ...updatedData } : user;
        })
        .filter((user) => !modifications.deleted.includes(user.id));

      // Add newly created users
      mergedUsers = [...mergedUsers, ...modifications.created];

      return mergedUsers;
    },
    [],
  );

  /**
   * Fetches users from JSON file and applies localStorage modifications.
   * Simulates GET /api/users endpoint behavior.
   */
  const getUsers = useCallback(async (): Promise<JsonUser[]> => {
    return makeApiRequest(async () => {
      const response = await apiClient.get<JsonUser[]>("/users.json");

      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: Failed to fetch users`);
      }

      const mergedUsers = mergeUsersWithModifications(response.data);
      setUsers(mergedUsers);
      return mergedUsers;
    }, "fetch users");
  }, [apiClient, makeApiRequest, mergeUsersWithModifications]);

  /**
   * Creates a new user with simulated API persistence.
   * Simulates POST /api/users endpoint - stores in localStorage.
   */
  const createUser = useCallback(
    async (user: CreateUser): Promise<JsonUser> => {
      return makeApiRequest(async () => {
        const newUser: JsonUser = {
          ...user,
          id: generateUniqueId(),
        };

        // Simulate API validation
        if (
          !user.firstName.trim() ||
          !user.lastName.trim() ||
          !user.email.trim()
        ) {
          throw new Error("Name and email are required fields");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
          throw new Error("Please provide a valid email address");
        }

        const modifications = getStoredModifications();
        modifications.created.push(newUser);
        saveModifications(modifications);

        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);

        return newUser;
      }, "create user");
    },
    [makeApiRequest, users],
  );

  /**
   * Updates an existing user with simulated API persistence.
   * Simulates PATCH /api/users/:id endpoint - stores in localStorage.
   */
  const updateUser = useCallback(
    async (id: string, userUpdate: Partial<JsonUser>): Promise<JsonUser> => {
      return makeApiRequest(async () => {
        const currentUser = users.find((u) => u.id === id);
        if (!currentUser) {
          throw new Error(`User with ID ${id} not found`);
        }

        // Simulate API validation
        if (
          userUpdate.email &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userUpdate.email)
        ) {
          throw new Error("Please provide a valid email address");
        }

        const updatedUser: JsonUser = {
          ...currentUser,
          ...userUpdate,
          id, // Ensure ID cannot be changed
        };

        const modifications = getStoredModifications();
        modifications.updated[id] = {
          ...modifications.updated[id],
          ...userUpdate,
        };
        saveModifications(modifications);

        const updatedUsers = users.map((u) => (u.id === id ? updatedUser : u));
        setUsers(updatedUsers);

        return updatedUser;
      }, "update user");
    },
    [makeApiRequest, users],
  );

  /**
   * Deletes a user with simulated API persistence.
   * Simulates DELETE /api/users/:id endpoint - tracks in localStorage.
   */
  const deleteUser = useCallback(
    async (userId: string): Promise<void> => {
      return makeApiRequest(async () => {
        const userExists = users.some((u) => u.id === userId);
        if (!userExists) {
          throw new Error(`User with ID ${userId} not found`);
        }

        const modifications = getStoredModifications();

        // If user was created locally, remove from created list
        modifications.created = modifications.created.filter(
          (u: JsonUser) => u.id !== userId,
        );

        // If user exists in original JSON, mark as deleted
        if (!modifications.created.some((u: JsonUser) => u.id === userId)) {
          modifications.deleted.push(userId);
        }

        // Remove from updates if present
        delete modifications.updated[userId];

        saveModifications(modifications);

        const updatedUsers = users.filter((u) => u.id !== userId);
        setUsers(updatedUsers);
      }, "delete user");
    },
    [makeApiRequest, users],
  );

  /**
   * Refreshes user data by re-fetching from JSON file.
   * Simulates cache refresh or polling behavior.
   */
  const refreshUsers = useCallback(async (): Promise<void> => {
    await getUsers();
  }, [getUsers]);

  /**
   * Resets to original JSON data by clearing localStorage modifications.
   * Useful for testing or returning to initial state.
   */
  const resetToDefaults = useCallback(async (): Promise<void> => {
    return makeApiRequest(
      async () => {
        localStorage.removeItem(STORAGE_KEY);
        await getUsers(); // Reload original data
      },
      "reset to defaults",
      false,
    );
  }, [makeApiRequest, getUsers]);

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
    resetToDefaults,
  };
};

export default useJsonApi;
