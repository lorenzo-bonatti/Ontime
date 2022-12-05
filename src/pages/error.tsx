import React, {ReactElement} from "react";
import {ButtonComponent} from "@syncfusion/ej2-react-buttons";

interface ErrorProps {
    /**
     * Error title
     */
    title?: string
    /**
     * Errore long description
     */
    description?: string
    /**
     * Enable retry button
     */
    enableRetry?: boolean
    /**
     * On retry action
     */
    onRetry?: () => void
}

export const Error = ({title, description, enableRetry, onRetry}: ErrorProps): ReactElement => {
    return (
        <div className="fullpage-container">
            <div className='w-96'>
                <p className='text-xl font-bold text-primary mb-2.5'>Ops! There is an error <i
                    className="fa-regular fa-face-frown"></i></p>
                {/* Title */}
                <p className='font-bold'>{title || 'General error'}</p>
                {/* Content */}
                <p className="mb-2.5">{description}</p>
                {/* Retry button */}
                {
                    enableRetry
                        ? <ButtonComponent
                            content="Retry"
                            iconCss="fa-solid fa-rotate-right"
                            isPrimary={true}
                            onClick={() => onRetry ? onRetry() : false}
                        />
                        : <></>
                }
            </div>
        </div>
    )
}