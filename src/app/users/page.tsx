import UserList from '@/client/components/features/user-list';

export const metadata = {
  title: 'Syntara - Users Management',
  description: 'Manage users, view roles, and monitor account credentials.',
};

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto mb-8">
        <nav className="flex space-x-2 text-sm text-zinc-400 mb-4 font-mono">
          <a href="/" className="hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">home</a>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-100 font-semibold">users</span>
        </nav>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl tracking-tight">
          System Administration
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          This administration page demonstrates a clean client-server architecture division in Next.js 16.
        </p>
      </div>

      <main>
        <UserList />
      </main>
    </div>
  );
}
