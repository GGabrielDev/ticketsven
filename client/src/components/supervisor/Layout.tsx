import { html } from "htm/preact";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import SupervisorAppBar from "./AppBar";

function Layout() {
  return html`
    <${SupervisorAppBar} />
    <${Box} sx=${{ width: 1, height: "calc(100% - 84.5px)" }}>
      <${Outlet} />
    <//>
  `;
}

export default Layout;
