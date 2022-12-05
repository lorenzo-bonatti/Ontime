import React, {ReactElement} from 'react';
import {ButtonComponent} from '@syncfusion/ej2-react-buttons';
import './index.scss';

interface AddTrackerProps {
	onDefaultTracker: () => void,
	onNormalTracker: () => void
}

export const AddTracker = (props: AddTrackerProps): ReactElement => {
	return (
		<div className="tracker add-tracker">
			{/* Title */}
			<p className="text-xl text-center text-primary">New tracker</p>
			{/* Default creation button */}
			<div className="text-center">
				<span onClick={() => props.onDefaultTracker()}>
					<i className="default-btn fa-solid fa-circle-plus fa-3x"/>
				</span>
			</div>
			{/* Other options */}
			<div className='space-y-2.5'>
				<p>Other tracker options</p>
				<ButtonComponent
					content='Normal Tracker'
					iconCss='fa-solid fa-business-time'
					cssClass='action-button'
					onClick={() => props.onNormalTracker()}
				/>
				{/*
				<ButtonComponent
					content='Jira Tracker'
					iconCss='fa-brands fa-jira'
					cssClass='action-button jira-tracker'
				/>
				*/}
			</div>
		</div>
	);
};