import { useState, createElement } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

import Root from "./routes/root";
import RootIndex from "./routes/index";
import { rootLoader, contentLoader}  from "./routes/dataLoader";
import { updateDemoFavorite } from "./routes/actions";
import ErrorPage from "./error-page";

import { demos } from "./demos/index";
import DemoWrapper from './routes/Wrapper'

import './App.css'


const childrenRoutes: any = demos.map(demo=>{
  const {comps, category} = demo;
  return {
    path: category,
    children: comps.map(Comp=>{
      return {
        path: Comp.path,
        element: <DemoWrapper><Comp/></DemoWrapper>,
        loader: contentLoader,
        action: updateDemoFavorite
      }
    }).concat({ index: true, element: <RootIndex /> })
  }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: childrenRoutes.concat({ index: true, element: <RootIndex /> })
  },

]);

function App() {
  return <RouterProvider router={router} />
}

export default App
