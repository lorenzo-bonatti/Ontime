import React, {ReactElement, useEffect} from 'react';
import {Authenticator, useAuthenticator} from '@aws-amplify/ui-react';
import {Outlet, useNavigate} from 'react-router-dom';
import {ButtonComponent} from '@syncfusion/ej2-react-buttons';
import {SidebarComponent} from "@syncfusion/ej2-react-navigations";
import Logo from '../../public/logo.svg';
import ItalyFlag from '@images/flags/italy.png';
import {DataStore} from "aws-amplify";
import {Languages, TrackerViewModes, UserSetting} from "@models/index";

export const AuthRoutes = (): ReactElement => {

    // Hooks
    const navigate = useNavigate();
    const {route} = useAuthenticator(context => [context.route]);

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

    // Default User settings
    useEffect(() => {
        if (route === "authenticated") {
            const obs = DataStore.observeQuery(UserSetting).subscribe(snapshot => {
                if (snapshot.isSynced && snapshot.items.length === 0) {
                    // Create default user settings
                    DataStore.save(
                        new UserSetting({
                            language: Languages.EN,
                            trackerViewMode: TrackerViewModes.CARD,
                            trackerAutoStart: false,
                            trackerStopOnNewStart: true
                        })
                    ).then(() => {
                        // Console log
                        console.log('UserSettings DEFAULTS');
                        // Unsubscribe
                        obs.unsubscribe();
                    })
                } else if (snapshot.isSynced) {
                    // Unsubscribe
                    obs.unsubscribe();
                }
            });
        }
    }, [route]);

    return (
        <Authenticator loginMechanisms={['email']} formFields={formFields}>
            {
                ({user, signOut}) => (
                    <>
                        {/* Sidebar menu */}
                        <SidebarComponent
                            width='300px'
                            isOpen={true}
                        >
                            <div className='h-full bg-primary p-5 space-y-5'>
                                {/* Logo image */}
                                <div className="flex flex-row items-center w-1/2 p-2.5 space-x-2.5">
                                    <img src={Logo} alt="Ontime logo" className='w-10'/>
                                    <p className='text-white text-xl'>Ontime</p>
                                </div>
                                <hr/>
                                {/* Pages */}
                                <ButtonComponent
                                    content='Dashboard'
                                    iconCss='fa-solid fa-house'
                                    isPrimary={true}
                                    cssClass='sidebar-button'
                                    onClick={() => navigate('/dashboard')}
                                />
                                <ButtonComponent
                                    content='Trackers'
                                    iconCss='fa-solid fa-stopwatch'
                                    isPrimary={true}
                                    cssClass='sidebar-button'
                                    onClick={() => navigate('/trackers')}
                                />
                                <ButtonComponent
                                    content='Work Logs'
                                    iconCss='fa-solid fa-business-time'
                                    isPrimary={true}
                                    cssClass='sidebar-button'
                                    onClick={() => navigate('/work-logs')}
                                />
                                <ButtonComponent
                                    content='Settings'
                                    iconCss='fa-solid fa-gear'
                                    isPrimary={true}
                                    cssClass='sidebar-button'
                                    onClick={() => navigate('/settings')}
                                />
                                <ButtonComponent
                                    content='Account'
                                    iconCss='fa-solid fa-user'
                                    isPrimary={true}
                                    cssClass='sidebar-button'
                                    onClick={() => navigate('/profile')}
                                />
                                <ButtonComponent
                                    content='Sign out'
                                    iconCss='fa-solid fa-right-from-bracket'
                                    isPrimary={true}
                                    cssClass='sidebar-button'
                                    onClick={() => signOut ? signOut() : null}
                                />
                            </div>
                        </SidebarComponent>
                        {/* Content */}
                        <div className='h-full'>
                            {/* Header */}
                            <div className='flex justify-end items-center space-x-2.5 h-14 px-5 shadow'>
                                {/* Language */}
                                <ButtonComponent cssClass='e-flat'>
                                    <img src={ItalyFlag} className='w- h-5' alt='Flag'/>
                                </ButtonComponent>
                                {/* Notifications */}
                                <ButtonComponent
                                    iconCss='fa-solid fa-bell'
                                    cssClass='relative e-flat'
                                    onClick={() => navigate('/notifications')}
                                >
                                    <span className="e-badge e-badge-primary e-badge-overlap e-badge-dot"></span>
                                </ButtonComponent>
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
                        </div>
                    </>
                )
            }
        </Authenticator>
    );
};