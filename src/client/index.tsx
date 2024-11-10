import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Patients } from "./routes/patients";

import './index.scss';
import { Layout } from "./layout";
import { AddPatient } from "./routes/add-patient";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Patients />,
      },
      {
        path: "/patients",
        element: <Patients />,
      },
      {
        path: "/add-patient",
        element: <AddPatient />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
