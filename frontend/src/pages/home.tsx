import useUserStore from '@/lib/stores/user.store';

export default function Home() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);
  return (
    <div className="container py-16">
      {isAuthenticated ? (
        <div>
          <h1>Welcome back, {user?.fullname}</h1>
        </div>
      ) : (
        <h1>Welcome to Formify</h1>
      )}
    </div>
  );
}
