/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps, SelectFieldProps, SwitchFieldProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type TrackerCreateFormInputValues = {
    title?: string;
    logDescription?: string;
    startedAt?: string;
    state?: string;
    ttid?: string;
    logServiceObject?: string;
    favorite?: boolean;
};
export declare type TrackerCreateFormValidationValues = {
    title?: ValidationFunction<string>;
    logDescription?: ValidationFunction<string>;
    startedAt?: ValidationFunction<string>;
    state?: ValidationFunction<string>;
    ttid?: ValidationFunction<string>;
    logServiceObject?: ValidationFunction<string>;
    favorite?: ValidationFunction<boolean>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TrackerCreateFormOverridesProps = {
    TrackerCreateFormGrid?: FormProps<GridProps>;
    title?: FormProps<TextFieldProps>;
    logDescription?: FormProps<TextFieldProps>;
    startedAt?: FormProps<TextFieldProps>;
    state?: FormProps<SelectFieldProps>;
    ttid?: FormProps<TextFieldProps>;
    logServiceObject?: FormProps<TextAreaFieldProps>;
    favorite?: FormProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type TrackerCreateFormProps = React.PropsWithChildren<{
    overrides?: TrackerCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: TrackerCreateFormInputValues) => TrackerCreateFormInputValues;
    onSuccess?: (fields: TrackerCreateFormInputValues) => void;
    onError?: (fields: TrackerCreateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: TrackerCreateFormInputValues) => TrackerCreateFormInputValues;
    onValidate?: TrackerCreateFormValidationValues;
} & React.CSSProperties>;
export default function TrackerCreateForm(props: TrackerCreateFormProps): React.ReactElement;
