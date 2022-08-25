import { Route } from "../types";
import { healthRoute } from "./health";
import { routeToLongUrlRoute } from "./route-to-long-url";
import { shortenRoute } from "./shorten";

export const routes: Route[] = [healthRoute, routeToLongUrlRoute, shortenRoute];
