import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import BecomeLandlord from './pages/BecomeLandlord';
import { USER_ROLES } from './types/user';
import { QueryProvider } from './providers/QueryProvider';
import PageLoader from './components/PageLoader';
import FetchErrorNotice from './components/FetchErrorNotice';
import { isMissingUserError, useCurrentUser } from './hooks/useCurrentUser';
import { useAuthStore } from './stores/authStore';
import './App.scss';

const MISSING_USER_MESSAGE = 'Пользователь не найден';

function BecomeLandlordRoute() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();

  // PageLoader is already shown for the background route.
  // Returning null avoids a redirect before the user is known.
  if (isUserLoading) {
    return null;
  }

  const canAccess =
    !!user &&
    !user.roles.includes(USER_ROLES.LANDLORD) &&
    (user.roles.includes(USER_ROLES.CUSTOMER) ||
      user.roles.includes(USER_ROLES.MASTER));

  if (!canAccess) {
    return <Navigate to="/" replace />;
  }

  return <BecomeLandlord />;
}

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const logout = useAuthStore((state) => state.logout);
  const {
    isLoading: isUserLoading,
    isFetching: isUserFetching,
    isError: isUserError,
    error: userError,
    refetch: refetchUser,
  } = useCurrentUser();
  const userIsMissing = isMissingUserError(userError);

  if (userIsMissing) {
    return (
      <FetchErrorNotice
        message={MISSING_USER_MESSAGE}
        actionLabel="На главную"
        onAction={() => {
          logout();
          navigate('/', { replace: true });
        }}
      />
    );
  }

  if (isUserError) {
    if (isUserFetching) {
      return <PageLoader />;
    }

    return (
      <FetchErrorNotice
        message={
          userError instanceof Error ? userError.message : 'Произошла ошибка'
        }
        actionLabel="Повторить"
        onAction={() => {
          void refetchUser();
        }}
      />
    );
  }

  return (
    <>
      {isUserLoading ? (
        <PageLoader />
      ) : (
        <Routes location={background || location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Home />} />
          <Route path="/become-landlord" element={<Home />} />
        </Routes>
      )}

      {(background ||
        location.pathname === '/login' ||
        location.pathname === '/become-landlord') && (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/become-landlord" element={<BecomeLandlordRoute />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
