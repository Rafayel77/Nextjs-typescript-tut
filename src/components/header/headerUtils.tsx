//import { Location, NavigateFunction } from "react-router-dom";
import { NextRouter } from "next/router";
import { ROUTES } from "../../configRoutes";

export const navigatePages = (router: NextRouter, prevPath: string, nextPath: string) => {
  if (prevPath !== nextPath) {
    router.push(nextPath);
  }
};

export const handleLogIn = (router: NextRouter, location: string ) => {
  navigatePages(router, location, ROUTES.LOGIN);
};
