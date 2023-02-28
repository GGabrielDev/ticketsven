import { BrowserRouter, Route, Routes } from "react-router-dom";
import { html } from "htm/preact";
import { useAppSelector } from "./redux/hooks";
import { selectors } from "./redux/features/user/userSlice";
import AuthController from "./pages/AuthController";
import Login from "./pages/Login";
import NotFound from "./components/NotFound";
import LoadingBox from "./components/LoadingBox";

import AdminLayout from "./components/admin/Layout";
import AdminLanding from "./pages/admin/Landing";
import Municipality from "./pages/admin/Municipality";
import OrganismGroup from "./pages/admin/OrganismGroups";
import Organism from "./pages/admin/Organism";
import Parish from "./pages/admin/Parish";
import Quadrant from "./pages/admin/Quadrant";
import Reason from "./pages/admin/Reason";
import User from "./pages/admin/User";

import OperatorLayout from "./components/operator/Layout";
import OperatorLanding from "./pages/operator/Landing";
import OperatorForm from "./pages/operator/Form";

import DispatcherLayout from "./components/dispatcher/Layout";
import DispatcherLanding from "./pages/dispatcher/Landing";
import DispatcherForm from "./pages/dispatcher/Form";

import SupervisorLayout from "./components/supervisor/Layout";

const { selectUser } = selectors;

function Router() {
  const user = useAppSelector(selectUser);

  return html`
    <${BrowserRouter}>
      <${AuthController}>
        <${Routes}>
          <${Route} path="/">
            <${Route} index element=${html`<${Login} />`} />
            ${user
              ? [
                  user.role.name === "admin" &&
                    html`
                      <${Route}
                        path="dashboard"
                        element=${html`<${AdminLayout} />`}
                      >
                        <${Route} path="*" element=${html`<${NotFound} />`} />
                        <${Route} index element=${html`<${AdminLanding} />`} />
                        <${Route}
                          path="municipality"
                          element=${html`<${Municipality} />`}
                        />
                        <${Route}
                          path="organismGroup"
                          element=${html`<${OrganismGroup} />`}
                        />
                        <${Route}
                          path="organism"
                          element=${html`<${Organism} />`}
                        />
                        <${Route}
                          path="parish"
                          element=${html`<${Parish} />`}
                        />
                        <${Route}
                          path="quadrant"
                          element=${html`<${Quadrant} />`}
                        />
                        <${Route}
                          path="reasons"
                          element=${html`<${Reason} />`}
                        />
                        <${Route} path="users" element=${html`<${User} />`} />
                      <//>
                    `,
                  user.role.name === "operator" &&
                    html`
                      <${Route}
                        path="dashboard"
                        element=${html`<${OperatorLayout} />`}
                      >
                        <${Route} path="*" element=${html`<${NotFound} />`} />
                        <${Route}
                          index
                          element=${html`<${OperatorLanding} />`}
                        />
                        <${Route}
                          path="form"
                          element=${html`<${OperatorForm} />`}
                        />
                      <//>
                    `,
                  user.role.name === "dispatcher" &&
                    html`
                      <${Route}
                        path="dashboard"
                        element=${html`<${DispatcherLayout} />`}
                      >
                        <${Route}
                          index
                          element=${html`<${DispatcherLanding} />`}
                        />
                        <${Route}
                          path=":ticketId"
                          element=${html`<${DispatcherForm} />`}
                        />
                      <//>
                    `,
                  user.role.name === "supervisor" &&
                    html`
                      <${Route}
                        path="dashboard"
                        element=${html`<${SupervisorLayout} />`}
                      >
                      <//>
                    `,
                ]
              : html`<${Route} path="*" element=${html`<${LoadingBox} />`} />`}
          <//>
        <//>
      <//>
    <//>
  `;
}

export default Router;
