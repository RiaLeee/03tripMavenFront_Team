import { Navigate, Route, Routes } from "react-router-dom";
import { PronunContext } from "../../context/PronunContext";
import Login from "./LogIn";
import LoginSuccess from "./LogInSuccess";
import Signup from "./SignUp";
import FindPassword1 from "./FindPassword1";
import FindPassword2 from "./FindPassword2";
import FindPassword3 from "./FindPassword3";
import PasswordChangeForm from "./PasswordChangeForm";

export default function LoginRoutes() {
    return <>
        <PronunContext.Provider value={{}}>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/success" element={<LoginSuccess />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/findpassword1' element={<FindPassword1 />} />
                <Route path='/findpassword2' element={<FindPassword2 />} />
                <Route path='/findpassword3' element={<FindPassword3 />} />
                <Route path='/passwordchange' element={<PasswordChangeForm />} />
                <Route path="*" element={<Navigate to="/" replace={true} />} />
            </Routes>
        </PronunContext.Provider>
    </>
}