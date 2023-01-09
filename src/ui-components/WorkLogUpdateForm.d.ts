/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { WorkLog } from "../models";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps, SelectFieldProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type WorkLogUpdateFormInputValues = {
    title?: string;
    description?: string;
    startedAt?: string;
    endedAt?: string;
    ttid?: string;
    logServiceObject?: string;
    state?: string;
};
export declare type WorkLogUpdateFormValidationValues = {
    title?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    startedAt?: ValidationFunction<string>;
    endedAt?: ValidationFunction<string>;
    ttid?: ValidationFunction<string>;
    logServiceObject?: ValidationFunction<string>;
    state?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type WorkLogUpdateFormOverridesProps = {
    WorkLogUpdateFormGrid?: FormProps<GridProps>;
    title?: FormProps<TextFieldProps>;
    description?: FormProps<TextFieldProps>;
    startedAt?: FormProps<TextFieldProps>;
    endedAt?: FormProps<TextFieldProps>;
    ttid?: FormProps<TextFieldProps>;
    logServiceObject?: FormProps<TextAreaFieldProps>;
    state?: FormProps<SelectFieldProps>;
} & EscapeHatchProps;
export declare type WorkLogUpdateFormProps = React.PropsWithChildren<{
    overrides?: WorkLogUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    workLog?: WorkLog;
    onSubmit?: (fields: WorkLogUpdateFormInputValues) => WorkLogUpdateFormInputValues;
    onSuccess?: (fields: WorkLogUpdateFormInputValues) => void;
    onError?: (fields: WorkLogUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: WorkLogUpdateFormInputValues) => WorkLogUpdateFormInputValues;
    onValidate?: WorkLogUpdateFormValidationValues;
} & React.CSSProperties>;
export default function WorkLogUpdateForm(props: WorkLogUpdateFormProps): React.ReactElement;
