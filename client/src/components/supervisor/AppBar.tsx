import { useState, useEffect } from "preact/hooks";
import { html } from "htm/preact";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { useAppDispatch } from "../../redux/hooks";
import { actions } from "../../redux/features/user/userSlice";
import Logo from "../../assets/logo.png";

const { logout, toggleColorTheme } = actions;

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [anchorElUser, setAnchorElUser] = useState<null | EventTarget>(null);

  const handleOpenUserMenu = (event: MouseEvent) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = (e: Event) => {
    e.stopPropagation();
    setAnchorElUser(null);
    dispatch(logout());
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentTime(new Date().toLocaleTimeString());
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  return html`
    <${AppBar} position="sticky" sx=${{ p: 1, display: "flex" }}>
      <${Container} maxWidth="xl">
        <${Toolbar}
          disableGutters
          sx=${{ justifyContent: "space-between", gap: 2 }}
        >
          <${Box}
            component="img"
            href="/"
            sx=${{
              height: 64,
              display: "flex",
              mr: 1,
              cursor: "pointer",
            }}
            alt="Your logo."
            src=${Logo}
            onClick=${() => navigate("/dashboard")}
          />
          <${Box}
            sx=${{
              display: { xs: "none", sm: "flex" },
              flexFlow: "column wrap",
              flexGrow: 1,
              justifyContent: "flex-start",
            }}
          >
            <${Typography} variant="subtitle2"
              ><strong>Fecha:</strong> ${new Date().toLocaleDateString(
                "es-ES",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}<//
            >
            <${Typography} variant="subtitle2"
              ><strong>Hora:</strong> ${currentTime}<//
            >
          <//>
          <${Typography}
            component="h1"
            variant="h6"
            sx=${{ display: { xs: "none", sm: "flex" } }}
          >
            Vista de Supervisor
          <//>
          <${Box} sx=${{ flexGrow: 0 }}>
            <${Tooltip} title="Open settings">
              <${IconButton}
                onClick=${handleOpenUserMenu}
                sx=${{ p: 0, color: "inherit" }}
              >
                <${Person} />
              <//>
            <//>
            <${Menu}
              sx=${{ mt: "45px" }}
              id="menu-appbar"
              anchorEl=${anchorElUser}
              anchorOrigin=${{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin=${{
                vertical: "top",
                horizontal: "right",
              }}
              open=${Boolean(anchorElUser)}
              onClose=${handleCloseUserMenu}
            >
              <${MenuItem} onClick=${() => dispatch(toggleColorTheme())}>
                <${Typography} textAlign="center">Cambiar tema<//>
              <//>
              <${MenuItem} onClick=${handleLogout}>
                <${Typography} textAlign="center">Cerrar sesión<//>
              <//>
            <//>
          <//>
        <//>
      <//>
    <//>
  `;
}
export default ResponsiveAppBar;
