import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState} from "../types";

const initialState: AuthState = {
  user: {
    id: 0,
    lastName: "",
    firstName: "",
    middleName: "",
    email: "",
    role: {
      id: 0,
      name: "",
    },
    photo: "",
    additionalInfo: {
      classLetter: undefined,
      classNumber: undefined,
      idClass: undefined,
      idStudent: undefined,
      idEmployee: undefined,
      idParent: undefined,
      childrenIds: undefined,
      position: undefined,
    },
  },
  accessToken: "",
  refreshToken: "",
  isAuth: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<AuthState>
    ) {
      state.user = action.payload.user;
      state.isAuth = action.payload.isAuth;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    logout(state) {
      state.user = initialState.user;
      state.isAuth = false;
      state.accessToken = "";
      state.refreshToken = "";
    },
    updateUserPhoto(state, action: PayloadAction<string>) {
      state.user.photo = action.payload;
    }
  },
});

export const { setUser, logout, updateUserPhoto } = userSlice.actions;
export default userSlice.reducer;
