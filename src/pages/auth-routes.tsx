import React, {ReactElement} from 'react';
import {Authenticator} from '@aws-amplify/ui-react';
import {Outlet, useNavigate} from 'react-router-dom';
import {ButtonComponent} from '@syncfusion/ej2-react-buttons';

export const AuthRoutes = (): ReactElement => {

    // Hooks
    const navigate = useNavigate();

    // Authenticator fields settings
    const formFields = {
        signUp: {
            name: {
                order: 1
            },
            email: {
                order: 2
            }
        }
    }

    return (
        <Authenticator loginMechanisms={['email']} formFields={formFields}>
            {
                ({user}) => (
                    <>
                        {/* Header */}
                        <div className='flex justify-between items-center h-12 p-2.5 shadow'>
                            {/* Logo */}
                            <span
                                className="text-lg text-primary font-bold cursor-pointer"
                                onClick={() => navigate('/dashboard')}
                            >
								Ontime
							</span>
                            {/* Profile */}
                            <ButtonComponent
                                content={`Ciao ${user?.attributes?.name || ''}`}
                                isPrimary={true}
                                cssClass='e-flat'
                                onClick={() => navigate('/profile')}
                            />
                        </div>
                        {/* Content */}
                        <div className='auth-container overflow-y-auto'>
                            <Outlet/>
                        </div>
                    </>
                )
            }
        </Authenticator>
    );
};