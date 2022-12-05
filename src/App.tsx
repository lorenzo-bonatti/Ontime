import React, {ReactElement, useEffect, useMemo, useRef, useState} from 'react';
import {FeedbackState} from './store/feedback';
import {useStoreSelector} from './store';
import {ToastComponent} from '@syncfusion/ej2-react-notifications';
import {Pages} from './pages';
import {version} from '../package.json';

export const App = (): ReactElement => {

    // Store
    const feedback: FeedbackState = useStoreSelector(state => state.feedback);

    // Ref
    const toast = useRef<ToastComponent | null>(null);

    enum ToastCss {
        success = 'e-toast-success',
        warning = 'e-toast-warning',
        error = 'e-toast-danger',
        info = 'e-toast-into'
    }

    // State
    const [ready, setReady] = useState(false);

    // Feedback event listener
    useEffect(() => {
        // Check if there is any feedback
        if (feedback.data) {
            // Show feedback toast
            toast.current?.show({
                title: feedback.data.title,
                content: feedback.data.content || '',
                cssClass: ToastCss[feedback.data.type || 'info'],
                timeOut: feedback.data.timeout || 4000,
                position: {X: 'Center', Y: 'Bottom'},
                showCloseButton: true,
                showProgressBar: true
            });
        }
    }, [feedback]);

    useEffect(() => {
        // Ready!
        setReady(true);
    }, [])

    // Pages
    const PagesMemo = useMemo(() => (
        ready ? <Pages/> : <></>
    ), [ready]);

    return (
        <div id='app' className='w-screen h-screen overflow-hidden'>
            {/* Include pages */}
            {PagesMemo}
            {/* App Version */}
            <small className='fixed bottom-0 left-0'>v{version}</small>
            {/* Feedback toast */}
            <ToastComponent ref={toast} target='#app'/>
        </div>
    );
};