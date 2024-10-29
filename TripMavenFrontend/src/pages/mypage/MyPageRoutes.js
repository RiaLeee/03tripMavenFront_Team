import { Navigate, Route, Routes } from "react-router-dom";

import MypageUpdate from "./MyPageUpdate";
import MypageProfile from "./MyPageProfile";
import AdminReport from "./adminmypage/AdminReport";
import MemberList from "./adminmypage/MemberList";
import AdminAnswer from "./adminmypage/AdminAnswer";
import PostDetails from "../productPage/PostDetails";
import RoleBasedRoute from "../../components/RoleBasedRoute";
import GuideMyPageMyPost from "../guidemypage/GuideMyPageMyPost";
import GuideMyPageAIService from "../guidemypage/guidemypageaiservice/GuideMyPageAIService";
import ProductPost from "../productPage/ProductPost";
import { MypageContext } from "../../context/MypageContext";
import { useEffect, useState } from "react";
import { csAllget } from "../../utils/csData";
import AskDetailsView from "../askpage/AskDetailsView";
import AskAll from "../askpage/AskAll";


export default function MyPageRoutes() {
    const [inquiries, setInquiries] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const getCSData = async () => {
            try {
                const fetchedData = await csAllget();
                setInquiries(fetchedData);
                setTotalPages(Math.ceil(fetchedData.length / 10));
            } catch (error) {
                console.error('에러났당', error);
            }
        };
        getCSData();
    }, []);

    return <>
        <MypageContext.Provider value={{ inquiries, totalPages }}>
            <Routes>
                <Route path="/:id" element={<MypageProfile />} />
                <Route path="/update/:id" element={<MypageUpdate />} />
                <Route path='/askdetailsview/:id' element={<AskDetailsView />} />
                <Route path='/PostDetails/:id' element={<PostDetails />} />
                <Route path='/askall' element={<AskAll />} />

                {/* GUIDE */}
                <Route path='/guide/Post/:id' element={<RoleBasedRoute element={<ProductPost />} requiredRole={["GUIDE", "ADMIN"]} />} />
                <Route path='/guide/post' element={<RoleBasedRoute element={<GuideMyPageMyPost />} requiredRole={["GUIDE", "ADMIN"]} />} />
                <Route path='/guide/aiservice' element={<RoleBasedRoute element={<GuideMyPageAIService />} requiredRole={["GUIDE", "ADMIN"]} />} />

                {/* ADMIN */}
                <Route path='/admin/report' element={<RoleBasedRoute element={<AdminReport />} requiredRole={["ADMIN"]} />} />
                <Route path='/admin/memberlist' element={<RoleBasedRoute element={<MemberList />} requiredRole={["ADMIN"]} />} />
                <Route path='/admin/Answer/:id' element={<RoleBasedRoute element={<AdminAnswer />} requiredRole={["ADMIN"]} />} />

                <Route path="*" element={<Navigate to="/" replace={true} />} />
            </Routes>
        </MypageContext.Provider>
    </>
}