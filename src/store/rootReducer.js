

import layout from "./layout";
import authCustomerSlice  from "./reducer/auth/authCustomerSlice";
import  capabilitySlice  from "./reducer/auth/capabilitySlice";

const rootReducer = {
    layout,
    authCustomerSlice,
    capabilitySlice
}


export default rootReducer