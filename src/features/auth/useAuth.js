import { useDispatch, useSelector } from "react-redux";
import { loginThunk, registerThunk, logout } from "./authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);

  return {
    ...auth,
    login: (payload) => dispatch(loginThunk(payload)),
    register: (payload) => dispatch(registerThunk(payload)),
    logout: () => dispatch(logout())
  };
}
