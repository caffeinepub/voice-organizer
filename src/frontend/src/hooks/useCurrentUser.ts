import { useInternetIdentity } from './useInternetIdentity';
import { useGetCallerUserProfile } from './useQueries';

export function useCurrentUser() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();

  return {
    identity,
    userProfile,
    isLoading,
    isFetched,
    isAuthenticated: !!identity,
    principal: identity?.getPrincipal().toString(),
  };
}

export { useGetCallerUserProfile };
