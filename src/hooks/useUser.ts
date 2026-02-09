import { IUser } from "@/types/users";
import { useAsyncAction } from "./useAsync";
import { updateProfile } from "@/services/user.service";

export function useCreateUser() {
  const { run, loading } = useAsyncAction();

  const create = (payload: { email: string; password: string }) =>
    run(() => updateProfile(payload));

  return {
    createUser: create,
    loading,
  };
}

// export function useGetProfile() {
//   const { run, loading } = useAsyncAction();

//   const getProfile = () => run(() => getProfile());

//   return {
//     getProfile,
//     loading,
//   };
// }