import { NextResponse } from 'next/server';
import { GetUsersUseCase } from '@/server/use-cases/get-users.usecase';

export async function GET() {
  try {
    const getUsersUseCase = new GetUsersUseCase();
    const users = await getUsersUseCase.execute();
    
    // Convert to plain objects and demonstrate domain logic (masking email)
    const plainUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.maskEmail(),
      role: user.role,
      createdAt: user.createdAt,
    }));

    return NextResponse.json(plainUsers);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
