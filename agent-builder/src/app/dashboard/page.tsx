// src/app/dashboard/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Dashboard',
  description: 'Welcome to your personal dashboard.',
};

export default function DashboardPage() {
  return (
    <div>
      <h2>Dashboard Overview</h2>
      <p>
        This is your main dashboard area. Content for the overview will go here.
      </p>
      {/* Add dashboard widgets or content here in the future */}
    </div>
  );
}