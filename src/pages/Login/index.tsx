import { useState } from 'react';
import Modal from '../../components/Modal';
import LoginWelcome from './LoginWelcome';
import LoginPhone from './LoginPhone';
import LoginName from './LoginName';
import LoginCode from './LoginCode';
import LoginLoading from './LoginLoading';
import LoginChooseProfile from './LoginChooseProfile';
import { useAuthStore } from '../../stores/authStore';
import { useProfiles } from '../../hooks/useProfilesMock';

const LOGIN_STEPS = {
  Welcome: 'welcome',
  Phone: 'phone',
  Code: 'code',
  Name: 'name',
  ProfileCreation: 'profileCreation',
  ChooseProfile: 'chooseProfile',
  Authorization: 'authorization',
} as const;

type LoginStep = (typeof LOGIN_STEPS)[keyof typeof LOGIN_STEPS];

function Login() {
  const [step, setStep] = useState<LoginStep>(LOGIN_STEPS.Welcome);
  const [phone, setPhone] = useState('');
  const [newUserData, setNewUserData] = useState<{
    name: string;
    surname: string;
  } | null>(null);

  const { data: profiles } = useProfiles();
  const selectedProfileId = useAuthStore((state) => state.selectedProfileId);
  const setSelectedProfileId = useAuthStore(
    (state) => state.setSelectedProfileId
  );

  const selectedProfile = profiles?.find((p) => p.id === selectedProfileId);

  const handlePhoneNext = (phoneValue: string) => {
    setPhone(phoneValue);
    setStep(LOGIN_STEPS.Code);
  };

  const handleCodeNext = (codeValue: string) => {
    // TODO: Check if user exists
    // TODO: Replace with actual API call
    const userExists = codeValue === '123456';

    if (!userExists) {
      setStep(LOGIN_STEPS.Name);
    } else {
      setStep(LOGIN_STEPS.ChooseProfile);
    }
  };

  const handleNameNext = ({
    name,
    surname,
  }: {
    name: string;
    surname: string;
  }) => {
    setNewUserData({ name, surname });
    setStep(LOGIN_STEPS.ProfileCreation);
  };

  const handleChooseProfileNext = (profileId: string) => {
    setSelectedProfileId(profileId);
    // TODO: make sure it waits for the selected profile to be loaded
    setStep(LOGIN_STEPS.Authorization);
  };

  const handleDone = () => {
    // TODO: navigate to main app (update background page with user info)
    console.log('Login complete:', {
      phone,
      newUserData,
      selectedProfileId,
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
        <LoginName phone={phone} onNext={handleNameNext} />
      )}
      {step === LOGIN_STEPS.ProfileCreation && (
        <LoginLoading onNext={handleDone} successMessage="Готово!" />
      )}
      {step === LOGIN_STEPS.ChooseProfile && (
        <LoginChooseProfile onNext={handleChooseProfileNext} />
      )}
      {step === LOGIN_STEPS.Authorization && (
        <LoginLoading
          onNext={handleDone}
          successMessage="С возвращением,"
          highlightedText={`${selectedProfile?.name}!`}
        />
      )}
    </Modal>
  );
}

export default Login;
