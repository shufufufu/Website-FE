import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  Culture,
  VideoClips,
  StarsCanvas,
} from "./components";
import Register from "./components/sections/Register";
import Login from "./components/sections/Login";
import Profile from "./components/sections/Profile";
import { useEffect } from "react";
import { config } from "./constants/config";

// 滚动到顶部组件
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const HomePage = () => {
  return (
    <>
      <div className="bg-hero-pattern bg-cover bg-center bg-no-repeat">
        <Hero />
      </div>
      <About />
      <Experience />
      <Tech />
      <Works />
      <Feedbacks />
      <div className="relative z-0">
        <Contact />
        <StarsCanvas />
      </div>
    </>
  );
};

// 文化科普页面组件
const CulturePage = () => {
  return (
    <div className="pt-[120px]">
      <Culture />
      <div className="relative z-0">
        <StarsCanvas />
      </div>
    </div>
  );
};

// 片段欣赏页面组件
const VideoClipsPage = () => {
  return (
    <div className="pt-[120px]">
      <VideoClips />
      <div className="relative z-0">
        <StarsCanvas />
      </div>
    </div>
  );
};

// 个人中心页面组件
const ProfilePage = () => {
  return (
    <>
      <Profile />
      <div className="relative z-0">
        <StarsCanvas />
      </div>
    </>
  );
};

const App = () => {
  useEffect(() => {
    if (document.title !== config.html.title) {
      document.title = config.html.title;
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="bg-primary relative z-0">
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/culture" element={<CulturePage />} />
          <Route path="/videoclips" element={<VideoClipsPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
