import { useState } from 'react';
import Modal from '../../components/Modal';
import LoginWelcome from './LoginWelcome';
import LoginPhone from './LoginPhone';
import LoginName from './LoginName';
import LoginCode, { type LoginNextPayload } from './LoginCode';
import LoginLoading from './LoginLoading';
import LoginChooseRole from './LoginChooseRole';
import { useAuthStore } from '../../stores/authStore';
import { USER_ROLES, type UserRole } from '../../types/user';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/useCurrentUser';

const LOGIN_STEPS = {
  Welcome: 'welcome',
  Phone: 'phone',
  Code: 'code',
  Name: 'name',
  ProfileCreation: 'profileCreation',
  ChooseRole: 'chooseRole',
  Authorization: 'authorization',
} as const;

type LoginStep = (typeof LOGIN_STEPS)[keyof typeof LOGIN_STEPS];

function Login() {
  const [step, setStep] = useState<LoginStep>(LOGIN_STEPS.Welcome);
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');

  const setSelectedRole = useAuthStore((state) => state.setSelectedRole);
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;

  const {
    data: user,
    isFetching: isUserFetching,
    isError: isUserError,
  } = useCurrentUser();

  const handlePhoneNext = (phoneValue: string) => {
    setPhone(phoneValue);
    setStep(LOGIN_STEPS.Code);
  };

  const handleCodeNext = (payload: LoginNextPayload) => {
    if (!payload.isExistingUser) {
      setSmsCode(payload.smsCode);
      setStep(LOGIN_STEPS.Name);
      return;
    }

    const roles = payload.roles.filter((role) => role !== USER_ROLES.ADMIN);
    setStep(
      roles.length > 1 ? LOGIN_STEPS.ChooseRole : LOGIN_STEPS.Authorization
    );
  };

  const handleNameNext = () => {
    setStep(LOGIN_STEPS.ProfileCreation);
  };

  const handleChooseRoleNext = (role: UserRole) => {
    setSelectedRole(role);
    // TODO: make sure it waits for the selected role to be loaded
    setStep(LOGIN_STEPS.Authorization);
  };

  const handleDone = () => {
    navigate(background?.pathname || '/');
  };

  return (
    <Modal title="Авторизация">
      {step === LOGIN_STEPS.Welcome && (
        <LoginWelcome onNext={() => setStep(LOGIN_STEPS.Phone)} />
      )}
      {step === LOGIN_STEPS.Phone && (
        <LoginPhone initialPhone={phone} onNext={handlePhoneNext} />
      )}
      {step === LOGIN_STEPS.Code && (
        <LoginCode
          onNext={handleCodeNext}
          onBack={() => setStep(LOGIN_STEPS.Phone)}
          phone={phone}
        />
      )}
      {step === LOGIN_STEPS.Name && (
        <LoginName
          phone={phone}
          smsCode={smsCode}
          onNext={handleNameNext}
          onBackToPhone={() => setStep(LOGIN_STEPS.Phone)}
        />
      )}
      {step === LOGIN_STEPS.ProfileCreation && (
        <LoginLoading
          onNext={handleDone}
          isLoading={isUserFetching}
          isError={isUserError}
          successMessage="Готово!"
        />
      )}
      {step === LOGIN_STEPS.ChooseRole && user && (
        <LoginChooseRole onNext={handleChooseRoleNext} user={user!} />
      )}
      {step === LOGIN_STEPS.Authorization && (
        <LoginLoading
          onNext={handleDone}
          isLoading={isUserFetching}
          isError={isUserError}
          successMessage="С возвращением,"
          highlightedText={`${user?.firstName}!`}
        />
      )}
    </Modal>
  );
}

export default Login;
