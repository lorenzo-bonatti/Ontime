import React, {ReactElement} from "react";

export const Loading = (): ReactElement => {
    return (
        <div className="fullpage-container">
            <p className="text-primary text-lg uppercase">Loading <i className="fa-solid fa-spinner fa-spin"/></p>
        </div>
    )
}