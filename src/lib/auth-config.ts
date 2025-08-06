// NextAuth configuration
import type { AuthOptions, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { DatabaseService } from '@/lib/database';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // You'll need to add this method to DatabaseService
          const user = await DatabaseService.getUserByEmailWithPassword(credentials.email);
          
          if (!user) {
            return null;
          }

          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          
          if (!isValid) {
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists in our database
          const existingUser = await DatabaseService.getUserByEmail(user.email!);
          
          if (!existingUser) {
            // Create new user in database
            await DatabaseService.createUser({
              email: user.email!,
              firstName: (profile as Record<string, unknown>)?.given_name as string || user.name?.split(' ')[0] || '',
              lastName: (profile as Record<string, unknown>)?.family_name as string || user.name?.split(' ').slice(1).join(' ') || '',
              passwordHash: '', // No password for OAuth users
              preferredLocation: 'Comox Valley, BC',
              preferredRadiusKm: 25,
              subscriptionTier: 'registered', // Google OAuth users get registered tier
              monthlySalesLimit: 5
            });
            console.log('Created new user in database:', user.email);
          } else {
            console.log('User already exists in database:', user.email);
          }
        } catch (error) {
          console.error('Error creating user in database:', error);
          return false; // Prevent sign in if database error
        }
      }
      return true;
    },
    async session({ session }) {
      if (session?.user?.email) {
        try {
          // Get updated user data from database
          const dbUser = await DatabaseService.getUserByEmail(session.user.email);
          if (dbUser) {
            session.user.id = dbUser.id.toString();
            session.user.name = `${dbUser.firstName} ${dbUser.lastName}`;
            (session.user as User & { firstName?: string; lastName?: string; subscriptionTier?: string }).firstName = dbUser.firstName;
            (session.user as User & { firstName?: string; lastName?: string; subscriptionTier?: string }).lastName = dbUser.lastName;
            (session.user as User & { firstName?: string; lastName?: string; subscriptionTier?: string }).subscriptionTier = dbUser.subscriptionTier;
          }
        } catch (error) {
          console.error('Error fetching user from database:', error);
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt' as const,
  },
};
