import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import BecomeLandlord from './pages/BecomeLandlord';
import { useAuthStore } from './stores/authStore';
import { USER_ROLES } from './types/user';
import { QueryProvider } from './providers/QueryProvider';
import './App.scss';

function BecomeLandlordRoute() {
  const location = useLocation();
  // TODO: check if this is correct (after adding token)
  const user = useAuthStore((state) => state.user);
  const canAccess =
    !!user &&
    !user.roles.includes(USER_ROLES.LANDLORD) &&
    (user.roles.includes(USER_ROLES.CUSTOMER) ||
      user.roles.includes(USER_ROLES.MASTER));

  if (!canAccess) {
    return <Navigate to="/login" state={{ background: location }} replace />;
  }

  return <BecomeLandlord />;
}

function AppRoutes() {
  const location = useLocation();
  const background = location.state?.background;

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Home />} />
        <Route path="/become-landlord" element={<Home />} />
      </Routes>

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
