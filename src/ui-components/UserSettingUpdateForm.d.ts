/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { UserSetting } from "../models";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps, SelectFieldProps, SwitchFieldProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type UserSettingUpdateFormInputValues = {
    language?: string;
    trackerAutoStart?: boolean;
    trackerStopOnNewStart?: boolean;
    trackerViewMode?: string;
    trackerViewSort?: string;
    dashboardTrackersPagination?: string;
};
export declare type UserSettingUpdateFormValidationValues = {
    language?: ValidationFunction<string>;
    trackerAutoStart?: ValidationFunction<boolean>;
    trackerStopOnNewStart?: ValidationFunction<boolean>;
    trackerViewMode?: ValidationFunction<string>;
    trackerViewSort?: ValidationFunction<string>;
    dashboardTrackersPagination?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UserSettingUpdateFormOverridesProps = {
    UserSettingUpdateFormGrid?: FormProps<GridProps>;
    language?: FormProps<SelectFieldProps>;
    trackerAutoStart?: FormProps<SwitchFieldProps>;
    trackerStopOnNewStart?: FormProps<SwitchFieldProps>;
    trackerViewMode?: FormProps<SelectFieldProps>;
    trackerViewSort?: FormProps<SelectFieldProps>;
    dashboardTrackersPagination?: FormProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type UserSettingUpdateFormProps = React.PropsWithChildren<{
    overrides?: UserSettingUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    userSetting?: UserSetting;
    onSubmit?: (fields: UserSettingUpdateFormInputValues) => UserSettingUpdateFormInputValues;
    onSuccess?: (fields: UserSettingUpdateFormInputValues) => void;
    onError?: (fields: UserSettingUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: UserSettingUpdateFormInputValues) => UserSettingUpdateFormInputValues;
    onValidate?: UserSettingUpdateFormValidationValues;
} & React.CSSProperties>;
export default function UserSettingUpdateForm(props: UserSettingUpdateFormProps): React.ReactElement;
