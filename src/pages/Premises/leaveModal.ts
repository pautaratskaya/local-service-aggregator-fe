import type { Location, NavigateFunction } from 'react-router-dom';

export function leaveModal(navigate: NavigateFunction, location: Location) {
  const background = location.state?.background as
    | { pathname: string; search?: string }
    | undefined;

  navigate(
    background
      ? `${background.pathname}${background.search ?? ''}`
      : '/premises',
  );
}
