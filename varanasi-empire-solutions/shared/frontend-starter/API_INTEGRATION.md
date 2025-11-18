# API Integration Guide

This document describes how to integrate with your backend API using the template's API client.

## Overview

The template includes a fully configured Axios instance with:
- JWT token management
- Request/response interceptors
- Automatic token refresh
- Error handling
- Type safety with TypeScript

## API Client Setup

The API client is configured in `/lib/api.ts` with the following features:

### Base Configuration

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
```

Configure your API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-api.com/api
```

## API Methods

### GET Request

```typescript
import { get } from '@/lib/api';

// Fetch data with type safety
const users = await get<User[]>('/users');

// With query parameters
const filteredUsers = await get<User[]>('/users', {
  page: 1,
  limit: 10,
  sort: 'name'
});
```

### POST Request

```typescript
import { post } from '@/lib/api';

const newUser = await post<User>('/users', {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});
```

### PUT Request

```typescript
import { put } from '@/lib/api';

const updatedUser = await put<User>('/users/1', {
  name: 'Jane Doe',
  email: 'jane@example.com'
});
```

### DELETE Request

```typescript
import { remove } from '@/lib/api';

await remove('/users/1');
```

### PATCH Request

```typescript
import { patch } from '@/lib/api';

const partialUpdate = await patch<User>('/users/1', {
  name: 'Jane'
});
```

## Authentication

### Token Management

The API client automatically:
1. Injects JWT token into request headers
2. Refreshes expired tokens
3. Clears tokens on 401 unauthorized
4. Redirects to login on token expiration

```typescript
import { setToken, getToken, clearAuthTokens } from '@/lib/api';

// Manually set token (done automatically after login)
setToken('your-jwt-token');

// Get current token
const token = getToken();

// Clear tokens (logout)
clearAuthTokens();
```

### Login Flow

```typescript
import { loginUser } from '@/lib/auth';

const response = await loginUser({
  email: 'user@example.com',
  password: 'password123'
});

// Tokens are automatically stored
// User data is in response.user
```

### Token Refresh

Tokens are automatically refreshed when they expire:

```typescript
// This happens automatically via interceptors
// No manual intervention needed
```

## Using with React Query

Combine the API client with React Query for data fetching:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { get, post } from '@/lib/api';

// GET with React Query
function UsersList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => get<User[]>('/users'),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// POST with React Query
function CreateUser() {
  const mutation = useMutation({
    mutationFn: (userData: User) => post<User>('/users', userData),
    onSuccess: (data) => {
      console.log('User created:', data);
      // Optionally invalidate queries
      // queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <button onClick={() => mutation.mutate({ name: 'John' })}>
      Create User
    </button>
  );
}
```

## Error Handling

### Automatic Error Handling

```typescript
try {
  const user = await get<User>('/users/999');
} catch (error) {
  if (error instanceof AxiosError) {
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
  }
}
```

### Global Error Handling

Configure error handling in interceptors:

```typescript
// In lib/api.ts
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);
```

### Error Types

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  timestamp: string;
}

interface ResponseError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, any>;
}
```

## Example: Complete User Management

```typescript
// services/users.ts
import { get, post, put, remove } from '@/lib/api';
import { User } from '@/types';

export const userService = {
  // Get all users
  getUsers: (page = 1, limit = 10) =>
    get<User[]>('/users', { page, limit }),

  // Get single user
  getUser: (id: string) =>
    get<User>(`/users/${id}`),

  // Create user
  createUser: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) =>
    post<User>('/users', data),

  // Update user
  updateUser: (id: string, data: Partial<User>) =>
    put<User>(`/users/${id}`, data),

  // Delete user
  deleteUser: (id: string) =>
    remove(`/users/${id}`),
};

// In your component
import { userService } from '@/services/users';
import { useQuery, useMutation } from '@tanstack/react-query';

export function UsersList() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>
          <span>{user.name}</span>
          <button onClick={() => deleteMutation.mutate(user.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Request Configuration

### Skip Error Handling

```typescript
const response = await get('/users', undefined, {
  skipErrorHandling: true
});
```

### Custom Timeout

```typescript
const response = await get('/heavy-operation', undefined, {
  timeout: 30000 // 30 seconds
});
```

## Interceptors

### Request Interceptor

Automatically adds JWT token to all requests:

```typescript
apiClient.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

Handles token refresh on 401:

```typescript
apiClient.interceptors.response.use(
  response => response.data,
  async error => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      const newToken = await refreshAuthToken();
      // Retry original request
    }
    return Promise.reject(error);
  }
);
```

## TypeScript Types

```typescript
// Define your API types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Use them with type-safe API calls
const user = await get<User>(`/users/${userId}`);
// user is typed as User | undefined

const newUser = await post<User>('/users', userData);
// newUser is typed as User
```

## Best Practices

1. **Create Service Files**: Organize API calls in service files
2. **Use React Query**: Leverage React Query for caching and state
3. **Error Handling**: Always handle potential errors
4. **Type Safety**: Always use TypeScript types for API responses
5. **Token Management**: Don't manually manage tokens; let the client handle it
6. **Environment Variables**: Use .env.local for API URLs
7. **Request Validation**: Use Zod to validate API responses
8. **Retry Logic**: Configure retry strategies for failed requests

## Common Issues

### CORS Errors

Ensure your backend allows CORS requests from your frontend URL:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization
```

### 401 Unauthorized

The client automatically handles token refresh. If you still get 401:
1. Check token validity
2. Verify refresh endpoint is working
3. Clear localStorage and re-login

### Network Errors

```typescript
try {
  const data = await get('/users');
} catch (error) {
  if (error instanceof AxiosError && !error.response) {
    console.log('Network error - no internet connection');
  }
}
```

## API Response Format

Expected API response format:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {
    "id": "123",
    "name": "John Doe"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

For lists:

```json
{
  "success": true,
  "message": "Retrieved successfully",
  "data": {
    "items": [],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Additional Resources

- [Axios Documentation](https://axios-http.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JWT.io](https://jwt.io)
