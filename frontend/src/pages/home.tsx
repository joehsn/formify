import FAB from '@/components/FAB';
import useUserStore from '@/lib/stores/user.store';

export default function Home() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);
  return (
    <div className="container py-16 relative">
      {isAuthenticated ? <AuthenticatedView /> : <h1>Welcome to Formify</h1>}
    </div>
  );
}

function AuthenticatedView() {
  const user = useUserStore((state) => state.user);
  return (
    <>
      <div>
        <h1
          className="text-4xl font-semibold text-center"
        >Welcome back, {user?.fullname}</h1>
      </div>
      <FAB />
    </>
  );
}
