/**
 * Represents a user object returned by the simulated JSON API.
 */
export interface JsonUser {
  /** Unique user ID (auto-generated) */
  id: string;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's email address */
  email: string;
  /** User's birth date (ISO string) */
  birthDate: string;
  /** URL to user's avatar image (optional) */
  avatarUrl?: string;
}

/**
 * Type for creating a new user (excludes ID, which is auto-generated).
 */
export type CreateUser = Omit<JsonUser, "id">;

/**
 * Configuration for axios requests to simulate API behavior.
 */
export interface ApiConfig {
  /** Base URL for JSON file requests */
  baseUrl: string;
  /** Timeout for axios requests (in ms) */
  timeout: number;
}

/**
 * Response wrapper for simulated API responses.
 */
export interface ApiResponse<T> {
  /** Response data */
  data: T;
  /** HTTP status code simulation */
  status: number;
  /** Status message */
  message: string;
}

/**
 * Return type for the useJsonApi hook with axios simulation.
 */
export interface UseJsonApiReturn {
  /** Array of user objects from JSON API */
  users: JsonUser[];
  /** Loading state for async operations */
  loading: boolean;
  /** Error message, if any */
  error: string | null;
  /** Fetches all users from JSON file via axios */
  getUsers: () => Promise<JsonUser[]>;
  /** Creates a new user (simulated with localStorage persistence) */
  createUser: (user: CreateUser) => Promise<JsonUser>;
  /** Updates an existing user by ID (simulated with localStorage persistence) */
  updateUser: (id: string, user: Partial<JsonUser>) => Promise<JsonUser>;
  /** Deletes a user by ID (simulated with localStorage persistence) */
  deleteUser: (userId: string) => Promise<void>;
  /** Refreshes the user list from JSON file */
  refreshUsers: () => Promise<void>;
  /** Resets to original JSON data (clears localStorage modifications) */
  resetToDefaults: () => Promise<void>;
}
