import { useEffect, useRef, useState } from "react";
import { Avatar, Button } from "@mui/material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

import Logo from "@components/logo";
import useLandingPage from "@pages/public/landingPage/hook";

import { Actions, Bar, Header, Links, LoginLink, LogoLink, LongLabel, ShortLabel, UserBadge } from "./styles";

export const Navbar = () => {
  const { user, data: content } = useLandingPage();
  const data = content.header;
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const state = { frame: 0 };

    const update = () => {
      state.frame = 0;
      const currentY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      headerRef.current?.style.setProperty("--read", (maxScroll > 0 ? currentY / maxScroll : 0).toFixed(4));
      setIsScrolled(currentY > 24);
    };

    const schedule = () => {
      if (!state.frame) state.frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.cancelAnimationFrame(state.frame);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  const displayName = user?.fullName || user?.name || user?.email?.split("@")[0] || "Usuário";

  return (
    <Header ref={headerRef}>
      <Bar data-scrolled={isScrolled} aria-label="Navegação principal">
        <LogoLink to="/" aria-label="uaiToNaFoto, página inicial">
          <Logo size="medium" variant="dark" animation="breathe" />
        </LogoLink>

        <Links>
          {data.links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.text}</a>
            </li>
          ))}
        </Links>

        <Actions>
          {user ? (
            <>
              <UserBadge to="/app" title={`Conectado como ${displayName}. Acessar painel.`}>
                <Avatar src={user.photoUrl} alt={displayName}>
                  {displayName.charAt(0).toUpperCase()}
                </Avatar>
                <span>
                  <small>Conectado</small>
                  <strong>{displayName}</strong>
                </span>
              </UserBadge>
              <Button
                component={RouterLink}
                to="/app"
                variant="contained"
                color="primary"
                endIcon={<ArrowForwardIcon />}
              >
                <LongLabel>Acessar painel</LongLabel>
                <ShortLabel>Entrar</ShortLabel>
              </Button>
            </>
          ) : (
            <>
              <LoginLink to={data.loginButton.href}>{data.loginButton.text}</LoginLink>
              <Button
                component={RouterLink}
                to={data.signupButton.href}
                variant="contained"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                data-cursor="bora!"
              >
                {data.signupButton.text}
              </Button>
            </>
          )}
        </Actions>
      </Bar>
    </Header>
  );
};

export default Navbar;
