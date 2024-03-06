import History from "./pages/History";
import ProductPage from "./pages/ProductPage";
import Settings from "./pages/Settings";


export const SETTINGS_ROUTE = '/settings';
export const HISTORY_ROUTE = '/history';
export const PRODUCT_ROUTE = '/sieve';


export const routes = [
    { path: SETTINGS_ROUTE, component: Settings },
    { path: HISTORY_ROUTE, component: History },
    { path: PRODUCT_ROUTE + /:sieve_id/, component: ProductPage },
]