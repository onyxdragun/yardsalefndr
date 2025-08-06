// Authentication types
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      firstName?: string;
      lastName?: string;
      subscriptionTier?: string;
    } & DefaultSession['user'];
  }

  interface User {
    firstName?: string;
    lastName?: string;
    subscriptionTier?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    firstName?: string;
    lastName?: string;
    subscriptionTier?: string;
  }
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  subscriptionTier?: string;
}
