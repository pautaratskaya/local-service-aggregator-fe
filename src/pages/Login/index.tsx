import { useState } from 'react';
import Modal from '../../components/Modal';
import LoginWelcome from './LoginWelcome';
import LoginPhone from './LoginPhone';
import LoginName from './LoginName';
import LoginCode, { type LoginNextPayload } from './LoginCode';
import LoginLoading from './LoginLoading';
import LoginChooseRole from './LoginChooseRole';
import { useAuthStore } from '../../stores/authStore';
import type { UserRole } from '../../types/user';
import { useLocation, useNavigate } from 'react-router-dom';

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

  const selectedRole = useAuthStore((state) => state.selectedRole);
  const user = useAuthStore((state) => state.user);
  const setSelectedRole = useAuthStore((state) => state.setSelectedRole);
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;

  const handlePhoneNext = (phoneValue: string) => {
    setPhone(phoneValue);
    setStep(LOGIN_STEPS.Code);
  };

  const handleCodeNext = (payload: LoginNextPayload) => {
    if (!payload.isExistingUser) {
      setStep(LOGIN_STEPS.Name);
      return;
    }

    const { roles } = payload;
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
    // TODO: make sure to update the page with user info
    console.log('===> background', background);
    navigate(background?.pathname || '/');

    console.log('===> Login complete:', {
      phone,
      user,
      selectedRole,
    });
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
          onNext={handleNameNext}
          onBackToPhone={() => setStep(LOGIN_STEPS.Phone)}
        />
      )}
      {step === LOGIN_STEPS.ProfileCreation && (
        <LoginLoading onNext={handleDone} successMessage="Готово!" />
      )}
      {step === LOGIN_STEPS.ChooseRole && (
        <LoginChooseRole onNext={handleChooseRoleNext} user={user!} />
      )}
      {step === LOGIN_STEPS.Authorization && (
        <LoginLoading
          onNext={handleDone}
          successMessage="С возвращением,"
          highlightedText={`${user?.firstName}!`}
        />
      )}
    </Modal>
  );
}

export default Login;
