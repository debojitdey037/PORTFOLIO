import { lazy, Suspense, useState, useEffect } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
const AdminDashboard = lazy(() => import("./components/Admin/AdminDashboard"));
import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  const [isAdminView, setIsAdminView] = useState(
    typeof window !== "undefined" && window.location.pathname === "/admin"
  );

  useEffect(() => {
    const onLocationChange = () => {
      setIsAdminView(window.location.pathname === "/admin");
    };
    window.addEventListener("popstate", onLocationChange);

    const handleAdminClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (target && target.getAttribute("href") === "/admin") {
        e.preventDefault();
        window.history.pushState({}, "", "/admin");
        setIsAdminView(true);
      }
    };
    document.addEventListener("click", handleAdminClick);

    return () => {
      window.removeEventListener("popstate", onLocationChange);
      document.removeEventListener("click", handleAdminClick);
    };
  }, []);

  if (isAdminView) {
    return (
      <Suspense fallback={<div style={{ color: "#fff", padding: "40px" }}>Loading Admin...</div>}>
        <AdminDashboard
          onExit={() => {
            window.history.pushState({}, "", "/");
            setIsAdminView(false);
          }}
        />
      </Suspense>
    );
  }

  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            <Suspense>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
