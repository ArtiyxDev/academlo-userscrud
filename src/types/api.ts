/**
 * Represents a user object returned by the API.
 */
export interface JsonUser {
  /** Unique user ID (auto-generated) */
  id: number;
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's email address */
  email: string;
  /** User's password (not returned in responses) */
  password?: string;
  /** User's birth date (YYYY-MM-DD format) */
  birthday: string;
  /** URL to user's avatar image (optional) */
  avatarUrl?: string;
  /** Timestamp when user was created */
  createdAt?: string;
  /** Timestamp when user was last updated */
  updatedAt?: string;
}

/**
 * Type for creating a new user (excludes auto-generated fields).
 */
export type CreateUser = Omit<JsonUser, "id" | "createdAt" | "updatedAt">;

/**
 * Configuration for axios requests to the API.
 */
export interface ApiConfig {
  /** Base URL for API requests */
  baseUrl: string;
  /** Timeout for axios requests (in ms) */
  timeout: number;
}

/**
 * Response wrapper for API responses.
 */
export interface ApiResponse<T> {
  /** Success status */
  success: boolean;
  /** Status message */
  message: string;
  /** Response data */
  data: T;
  /** Item count (for list endpoints) */
  count?: number;
}

/**
 * Return type for the useUsersApi hook.
 */
export interface UseUsersApiReturn {
  /** Array of user objects from API */
  users: JsonUser[];
  /** Loading state for async operations */
  loading: boolean;
  /** Error message, if any */
  error: string | null;
  /** Fetches all users from API */
  getUsers: () => Promise<JsonUser[]>;
  /** Creates a new user */
  createUser: (user: CreateUser) => Promise<JsonUser>;
  /** Updates an existing user by ID */
  updateUser: (id: number, user: Partial<CreateUser>) => Promise<JsonUser>;
  /** Deletes a user by ID */
  deleteUser: (userId: number) => Promise<void>;
  /** Refreshes the user list from API */
  refreshUsers: () => Promise<void>;
}
