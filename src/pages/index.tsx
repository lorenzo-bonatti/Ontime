import React, {lazy, Suspense, ReactElement, LazyExoticComponent} from 'react';
import {Route, Routes} from 'react-router-dom';
import {AuthRoutes} from './auth-routes';
import {Error} from './error';
import {GuestRoutes} from './guest-routes';
import {Loading} from './loading';
import {Home} from "@pages/home";

// Import pages
const Dashboard = lazy(() => import('./dashboard').then(module => ({default: module.Dashboard})));
const Profile = lazy(() => import('./profile').then(module => ({default: module.Profile})));
const Trackers = lazy(() => import('./trackers').then(module => ({default: module.Trackers})));
const WorkLogs = lazy(() => import('./work-logs').then(module => ({default: module.WorkLogs})));
const Settings = lazy(() => import('./settings').then(module => ({default: module.Settings})));

export const Pages = (): ReactElement => {

    // Lazy load wrapper
    const LazyWrapper = ({Page}: { Page: LazyExoticComponent<() => ReactElement> }): ReactElement => (
        <Suspense fallback={<Loading/>}>
            <Page/>
        </Suspense>
    );

    return (
        <Routes>
            {/* Authenticated routes */}
            <Route element={<AuthRoutes/>}>
                <Route path='/dashboard' element={<LazyWrapper Page={Dashboard}/>}/>
                <Route path='/trackers' element={<LazyWrapper Page={Trackers}/>}/>
                <Route path='/work-logs' element={<LazyWrapper Page={WorkLogs}/>}/>
                <Route path='/settings' element={<LazyWrapper Page={Settings}/>}/>
                <Route path='/profile' element={<LazyWrapper Page={Profile}/>}/>
            </Route>
            {/* Guest only routes */}
            <Route element={<GuestRoutes/>}>
                <Route path='/' element={<Home/>}/>
            </Route>
            {/* Other routes*/}
            <Route
                path='*'
                element={<Error title='Page not found' description='Check the page url and retry on a valid page'/>}
            />
        </Routes>
    );
};