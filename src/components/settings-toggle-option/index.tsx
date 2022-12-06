import {ReactElement} from "react";
import {SwitchComponent} from "@syncfusion/ej2-react-buttons";

interface Props {
    title: string
    description: string
    value: boolean
    onChange: (value: boolean) => void
}

export const SettingsSwitch = ({title, description, value, onChange}: Props): ReactElement => {
    return (
        <div>
            {/* Switch settings */}
            <div className="flex flex-row space-x-2 items-center">
                <SwitchComponent checked={value} change={(args: any) => onChange(args.checked)}/>
                <h2 className="text-lg">{title}</h2>
            </div>
            {/* Description */}
            <p>{description}</p>
        </div>
    )
}