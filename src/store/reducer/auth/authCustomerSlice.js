import { createSlice } from "@reduxjs/toolkit";

const storedCustomer = JSON.parse(localStorage.getItem("SAAS_BILLION_FORMS_customerInfo"));

// console.log("storedCustomer",storedCustomer);



export const authCustomerSlice = createSlice({
  name: "auth",
  initialState: {
    clientUser:  storedCustomer ? storedCustomer : null,
    isAuth: storedCustomer ? true : false
  },
  reducers: {
    setClientUser: (state, action) => {
      state.clientUser = action.payload;
      state.isAuth = true;
    },
    logOut: (state, action) => {
      state.clientUser = null;
      state.isAuth = false;
    },
  },
});

export const { setClientUser, logOut } = authCustomerSlice.actions;
export default authCustomerSlice.reducer;
