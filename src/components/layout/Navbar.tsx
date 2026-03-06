import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { styles } from "../../constants/styles";
import { navLinks } from "../../constants";
import { logo, menu, close } from "../../assets";
import { config } from "../../constants/config";
import { getCurrentUser } from "../../utils/auth";

const Navbar = () => {
  const [active, setActive] = useState<string | null>();
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 监听用户登录状态变化
    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 定期检查用户状态（适用于同一窗口的变化）
    const interval = setInterval(() => {
      setCurrentUser(getCurrentUser());
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
        setActive("");
      }
    };

    window.addEventListener("scroll", handleScroll);

    const navbarHighlighter = () => {
      const sections = document.querySelectorAll("section[id]");

      sections.forEach((current) => {
        const sectionId = current.getAttribute("id");
        // @ts-ignore
        const sectionHeight = current.offsetHeight;
        const sectionTop =
          current.getBoundingClientRect().top - sectionHeight * 0.2;

        if (sectionTop < 0 && sectionTop + sectionHeight > 0) {
          setActive(sectionId);
        }
      });
    };

    window.addEventListener("scroll", navbarHighlighter);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", navbarHighlighter);
    };
  }, []);

  return (
    <nav
      className={`${
        styles.paddingX
      } fixed top-0 z-20 flex w-full items-center py-5 ${
        scrolled ? "bg-primary" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt="logo" className="h-9 w-9 object-contain" />
          <p className="flex cursor-pointer text-[18px] font-bold text-[#e3d7b1] ">
            {config.html.title}
          </p>
        </Link>

        <ul className="hidden list-none flex-row gap-10 sm:flex">
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.id ? "text-white" : "text-secondary"
              } cursor-pointer text-[18px] hover:text-white font-bold`}
            >
              <a 
                href={`#${nav.id}`}
                onClick={(e) => {
                  if (location.pathname !== '/') {
                    e.preventDefault();
                    window.location.href = `/#${nav.id}`;
                  }
                }}
              >
                {nav.title}
              </a>
            </li>
          ))}
          
          {/* 登录/用户状态 */}
          {currentUser ? (
            <li
              className="cursor-pointer text-[18px] hover:text-white font-bold"
              onClick={() => navigate('/profile')}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#915EFF] to-[#7c3aed] flex items-center justify-center text-white text-[14px] font-semibold">
                  {currentUser.nickname.slice(-2)}
                </div>
                <span className="text-[#e3d7b1]">{currentUser.nickname}</span>
              </div>
            </li>
          ) : (
            <li
              className="cursor-pointer text-[18px] hover:text-white font-bold"
              onClick={() => navigate('/login')}
            >
              <span className="text-secondary hover:text-white transition-colors">登录</span>
            </li>
          )}
        </ul>

        <div className="flex flex-1 items-center justify-end sm:hidden">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="h-[28px] w-[28px] object-contain"
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } black-gradient absolute right-0 top-20 z-10 mx-4 my-2 min-w-[140px] rounded-xl p-6`}
          >
            <ul className="flex flex-1 list-none flex-col items-start justify-end gap-4">
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins cursor-pointer text-[16px] font-medium ${
                    active === nav.id ? "text-white" : "text-secondary"
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                  }}
                >
                  <a 
                    href={`#${nav.id}`}
                    onClick={(e) => {
                      if (location.pathname !== '/') {
                        e.preventDefault();
                        window.location.href = `/#${nav.id}`;
                      }
                    }}
                  >
                    {nav.title}
                  </a>
                </li>
              ))}
              
              {/* 移动端登录/用户状态 */}
              {currentUser ? (
                <li
                  className="font-poppins cursor-pointer text-[16px] font-medium text-white border-t border-white/10 pt-4 w-full"
                  onClick={() => {
                    setToggle(!toggle);
                    navigate('/profile');
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#915EFF] to-[#7c3aed] flex items-center justify-center text-white text-[14px] font-semibold">
                      {currentUser.nickname.slice(-2)}
                    </div>
                    <span className="text-[#e3d7b1]">{currentUser.nickname}</span>
                  </div>
                </li>
              ) : (
                <li
                  className="font-poppins cursor-pointer text-[16px] font-medium text-secondary border-t border-white/10 pt-4 w-full"
                  onClick={() => {
                    setToggle(!toggle);
                    navigate('/login');
                  }}
                >
                  登录
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
