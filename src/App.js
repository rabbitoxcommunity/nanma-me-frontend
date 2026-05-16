import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CustomCursor from "./components/ui/CustomCursor";
import WhatsAppCTA from "./components/ui/WhatsAppCTA";
import PageLoader from "./components/ui/PageLoader";

import { AuthProvider } from "./admin/context/AuthContext";
import { ToastProvider } from "./admin/components/Toast";
import { ConfirmProvider } from "./admin/components/ConfirmDialog";
import ProtectedRoute from "./admin/components/ProtectedRoute";

// ── Public pages (lazy) ──
const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const About = lazy(() => import("./pages/About"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));

// ── Admin (lazy) ──
const Login = lazy(() => import("./admin/pages/Login"));
const AdminLayout = lazy(() => import("./admin/components/AdminLayout"));
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const ProjectsList = lazy(() => import("./admin/pages/ProjectsList"));
const ProjectForm = lazy(() => import("./admin/pages/ProjectForm"));
const GalleryAdmin = lazy(() => import("./admin/pages/GalleryAdmin"));
const EnquiriesAdmin = lazy(() => import("./admin/pages/EnquiriesAdmin"));

function PublicLayout({ children }) {
  return (
    <div className="cursor-custom bg-bone min-h-screen text-ink relative">
      <CustomCursor />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppCTA />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          {/* Public site */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
          <Route path="/projects/:slug" element={<PublicLayout><ProjectDetail /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/:id" element={<ProjectForm />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="enquiries" element={<EnquiriesAdmin />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider>
          <ConfirmProvider>
            <BrowserRouter>
              <AnimatedRoutes />
            </BrowserRouter>
          </ConfirmProvider>
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
