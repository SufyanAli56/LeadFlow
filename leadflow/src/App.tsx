import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GuestRoute from "./components/auth/GuestRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signup";
import Dashboard from "./pages/dashboard/Dashboard";
import ComingSoon from "./pages/ComingSoon";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<ComingSoon title="Leads" />} />
            <Route
              path="/campaigns"
              element={<ComingSoon title="Campaigns" />}
            />
            <Route path="/inbox" element={<ComingSoon title="Inbox" />} />
            <Route path="/settings" element={<ComingSoon title="Settings" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
