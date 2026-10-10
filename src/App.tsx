import { useRef } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
  Outlet,
} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import BecomeLandlord from './pages/BecomeLandlord';
import BecomeMaster from './pages/BecomeMaster';
import Admin from './pages/Admin';
import AdminApplications from './pages/Admin/Applications';
import AdminCatalog from './pages/Admin/Catalog';
import AdminCatalogGroup from './pages/Admin/CatalogGroup';
import Profile from './pages/Profile';
import Workspaces from './pages/Workspaces';
import AddWorkspace from './pages/Workspaces/AddWorkspace';
import Header from './components/Header';
import { ROLE_APPLICATION_STATUSES, USER_ROLES } from './types/user';
import { ToastProvider } from './components/Toast';
import { QueryProvider } from './providers/QueryProvider';
import PageLoader from './components/PageLoader';
import FetchErrorNotice from './components/FetchErrorNotice';
import {
  isMissingUserError,
  isUnauthorizedUserError,
  useCurrentUser,
} from './hooks/useCurrentUser';
import { useAuthHydrated, useAuthStore } from './stores/authStore';
import './App.scss';

const MISSING_USER_MESSAGE = 'Пользователь не найден';
const INVALID_SESSION_MESSAGE = 'Сессия истекла. Войдите снова';

function backgroundPath(
  state: {
    background?: { pathname: string; search?: string };
  } | null,
) {
  const background = state?.background;

  return background ? `${background.pathname}${background.search ?? ''}` : '/';
}

function BecomeLandlordRoute() {
  const location = useLocation();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();

  // PageLoader is already shown for the background route.
  // Returning null avoids a redirect before the user is known.
  if (isUserLoading) {
    return null;
  }

  const canAccess =
    !!user &&
    !user.roles.includes(USER_ROLES.LANDLORD) &&
    (user.landlordRoleStatus === ROLE_APPLICATION_STATUSES.NO ||
      user.landlordRoleStatus === ROLE_APPLICATION_STATUSES.REJECTED);

  if (!canAccess) {
    return <Navigate to={backgroundPath(location.state)} replace />;
  }

  return <BecomeLandlord />;
}

function BecomeMasterRoute() {
  const location = useLocation();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();

  if (isUserLoading) {
    return null;
  }

  const canAccess =
    !!user &&
    !user.roles.includes(USER_ROLES.MASTER) &&
    (user.masterRoleStatus === ROLE_APPLICATION_STATUSES.NO ||
      user.masterRoleStatus === ROLE_APPLICATION_STATUSES.REJECTED);

  if (!canAccess) {
    return <Navigate to={backgroundPath(location.state)} replace />;
  }

  return <BecomeMaster />;
}

function WorkspacesRoute() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();

  if (isUserLoading) {
    return null;
  }

  if (!user?.roles.includes(USER_ROLES.LANDLORD)) {
    return <Navigate to="/" replace />;
  }

  return <Workspaces />;
}

function AdminRoute() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();

  if (isUserLoading) {
    return null;
  }

  if (!user?.roles.includes(USER_ROLES.ADMIN)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);
  const {
    data: user,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
    isError: isUserError,
    error: userError,
    refetch: refetchUser,
  } = useCurrentUser();
  const userIsMissing = isMissingUserError(userError);
  const authHydrated = useAuthHydrated();
  const sessionIsInvalid =
    isUnauthorizedUserError(userError) || (userId != null && !token);
  // Remember if the user was already logged in when /login opened.
  // Signing in on this screen must not redirect away from the success step.
  const enteredLoginWhileAuthenticated = useRef<boolean | null>(null);

  if (!authHydrated) {
    return <PageLoader />;
  }

  if (!isUserLoading && !isUserError) {
    if (location.pathname === '/login') {
      if (enteredLoginWhileAuthenticated.current === null) {
        enteredLoginWhileAuthenticated.current = !!user;
      }
    } else {
      enteredLoginWhileAuthenticated.current = null;
    }
  }

  const shouldLeaveLogin =
    location.pathname === '/login' &&
    enteredLoginWhileAuthenticated.current === true;
  const isPublicPath =
    location.pathname === '/' || location.pathname === '/login';
  const returnPath = `${location.pathname}${location.search}`;

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

  if (sessionIsInvalid) {
    return (
      <FetchErrorNotice
        message={INVALID_SESSION_MESSAGE}
        actionLabel="Войти"
        onAction={() => {
          logout();
          navigate('/login', {
            replace: true,
            state: { from: returnPath },
          });
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

  if (!user && !isUserLoading && !isPublicPath) {
    return <Navigate to="/login" replace state={{ from: returnPath }} />;
  }

  return (
    <>
      {isUserLoading ? (
        <PageLoader />
      ) : (
        <div className="appShell">
          {user && <Header user={user} />}
          <div className="page">
            <Routes location={background || location}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/workspaces" element={<WorkspacesRoute />} />
              <Route path="/add-workspace" element={<WorkspacesRoute />} />
              <Route path="/login" element={<Home />} />
              <Route path="/become-landlord" element={<Home />} />
              <Route path="/become-master" element={<Home />} />
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<Admin />} />
                <Route path="applications" element={<AdminApplications />} />
                <Route path="catalog" element={<AdminCatalog />} />
                <Route
                  path="catalog/:groupId"
                  element={<AdminCatalogGroup />}
                />
              </Route>
            </Routes>
          </div>
        </div>
      )}

      {shouldLeaveLogin ? (
        <Navigate to="/" replace />
      ) : (
        (background ||
          location.pathname === '/login' ||
          location.pathname === '/become-landlord' ||
          location.pathname === '/become-master' ||
          location.pathname === '/add-workspace') && (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/become-landlord" element={<BecomeLandlordRoute />} />
            <Route path="/become-master" element={<BecomeMasterRoute />} />
            <Route path="/add-workspace" element={<AddWorkspace />} />
          </Routes>
        )
      )}
    </>
  );
}

function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </QueryProvider>
  );
}

export default App;
