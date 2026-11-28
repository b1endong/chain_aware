import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";
import AuthLayout from "./components/layout/AuthLayout";
import AppLayout from "./components/layout/AppLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ModuleDetail from "./pages/ModuleDetail";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import Claim from "./pages/Claim";
import Certificate from "./pages/Certificate";
import Lab from "./pages/Lab";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// TODO: bọc các route trong AppLayout bằng guard đăng nhập (GET /api/me), /admin cần role "admin"
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="modules" element={<Navigate to="/dashboard" replace />} />
          <Route path="modules/:moduleId" element={<ModuleDetail />} />
          <Route path="modules/:moduleId/quiz" element={<Quiz />} />
          <Route path="modules/:moduleId/result" element={<QuizResult />} />
          <Route path="modules/:moduleId/claim" element={<Claim />} />
          <Route path="certificate" element={<Certificate />} />
          <Route path="lab" element={<Lab />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
