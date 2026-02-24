import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import ThanksKs from "@/pages/ThanksKs";
import { usePreserveQueryNavigate } from "@/hooks/usePreserveQueryNavigate";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { PaletteProvider } from "./contexts/PaletteContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ContentsManager from "./pages/ContentsManager";
import Home from "./pages/Home";

function ImageManagerRedirect() {
  const navigate = usePreserveQueryNavigate();
  useEffect(() => {
    navigate("/contents-manager");
  }, [navigate]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/thanks_ks"} component={ThanksKs} />
      <Route path={"/contents-manager"} component={ContentsManager} />
      <Route path={"/image-manager"} component={ImageManagerRedirect} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <PaletteProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </PaletteProvider>
    </ErrorBoundary>
  );
}

export default App;
