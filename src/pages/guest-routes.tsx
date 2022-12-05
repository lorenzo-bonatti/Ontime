import React, {ReactElement} from 'react';
import {useAuthenticator} from '@aws-amplify/ui-react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';

export const GuestRoutes = (): ReactElement => {

    // Hooks
    const location = useLocation();
    const {route} = useAuthenticator(context => [context.route]);

    return (
        <>
            {
                route === "authenticated"
                    ? <Navigate to={(location.state as { from: string })?.from || '/dashboard'} replace={true}/>
                    : <Outlet/>
            }
        </>
    );
};