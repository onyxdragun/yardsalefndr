// API endpoint for user registration
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({
        message: 'All fields are required',
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await DatabaseService.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({
        message: 'User already exists with this email',
      }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user with registered tier
    const user = await DatabaseService.createUser({
      firstName,
      lastName,
      email,
      passwordHash,
      preferredLocation: 'Comox Valley, BC',
      preferredRadiusKm: 25,
      subscriptionTier: 'registered',
      monthlySalesLimit: 5,
    });

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    
    return NextResponse.json({
      message: 'Internal server error',
    }, { status: 500 });
  }
}
