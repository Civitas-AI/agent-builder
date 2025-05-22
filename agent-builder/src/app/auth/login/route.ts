import { redirect } from 'next/navigation';

export async function GET() {
  // Redirect to the NextAuth signin page or handle auth directly
  return redirect('/api/auth/signin');
} 