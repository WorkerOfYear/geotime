import { Navigate, Route, Routes } from "react-router-dom";

import { routes } from "../routes";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                {routes.map((route) => (
                    <Route
                        key={routes.indexOf(route)}
                        element={<route.component />}
                        path={route.path}
                    />
                ))}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
