/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps, SelectFieldProps, SwitchFieldProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type UserSettingCreateFormInputValues = {
    language?: string;
    trackerAutoStart?: boolean;
    trackerStopOnNewStart?: boolean;
    trackerViewMode?: string;
    trackerViewSort?: string;
    dashboardTrackersPagination?: string;
};
export declare type UserSettingCreateFormValidationValues = {
    language?: ValidationFunction<string>;
    trackerAutoStart?: ValidationFunction<boolean>;
    trackerStopOnNewStart?: ValidationFunction<boolean>;
    trackerViewMode?: ValidationFunction<string>;
    trackerViewSort?: ValidationFunction<string>;
    dashboardTrackersPagination?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserSettingCreateFormOverridesProps = {
    UserSettingCreateFormGrid?: FormProps<GridProps>;
    language?: FormProps<SelectFieldProps>;
    trackerAutoStart?: FormProps<SwitchFieldProps>;
    trackerStopOnNewStart?: FormProps<SwitchFieldProps>;
    trackerViewMode?: FormProps<SelectFieldProps>;
    trackerViewSort?: FormProps<SelectFieldProps>;
    dashboardTrackersPagination?: FormProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type UserSettingCreateFormProps = React.PropsWithChildren<{
    overrides?: UserSettingCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: UserSettingCreateFormInputValues) => UserSettingCreateFormInputValues;
    onSuccess?: (fields: UserSettingCreateFormInputValues) => void;
    onError?: (fields: UserSettingCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: UserSettingCreateFormInputValues) => UserSettingCreateFormInputValues;
    onValidate?: UserSettingCreateFormValidationValues;
} & React.CSSProperties>;
export default function UserSettingCreateForm(props: UserSettingCreateFormProps): React.ReactElement;
