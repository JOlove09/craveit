import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import RecipeDetails from "./pages/RecipeDetails";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="*" element={<div className="container section-space text-center"><h2>Page not found</h2><a className="btn btn-brand mt-3" href="/">Back home</a></div>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
