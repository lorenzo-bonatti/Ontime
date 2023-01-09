/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { fetchByPath, validateField } from "./utils";
import { UserSetting } from "../models";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import {
  Button,
  Flex,
  Grid,
  SelectField,
  SwitchField,
} from "@aws-amplify/ui-react";
import { DataStore } from "aws-amplify";
export default function UserSettingCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onCancel,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    language: undefined,
    trackerAutoStart: false,
    trackerStopOnNewStart: false,
    trackerViewMode: undefined,
    trackerViewSort: undefined,
    dashboardTrackersPagination: undefined,
  };
  const [language, setLanguage] = React.useState(initialValues.language);
  const [trackerAutoStart, setTrackerAutoStart] = React.useState(
    initialValues.trackerAutoStart
  );
  const [trackerStopOnNewStart, setTrackerStopOnNewStart] = React.useState(
    initialValues.trackerStopOnNewStart
  );
  const [trackerViewMode, setTrackerViewMode] = React.useState(
    initialValues.trackerViewMode
  );
  const [trackerViewSort, setTrackerViewSort] = React.useState(
    initialValues.trackerViewSort
  );
  const [dashboardTrackersPagination, setDashboardTrackersPagination] =
    React.useState(initialValues.dashboardTrackersPagination);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setLanguage(initialValues.language);
    setTrackerAutoStart(initialValues.trackerAutoStart);
    setTrackerStopOnNewStart(initialValues.trackerStopOnNewStart);
    setTrackerViewMode(initialValues.trackerViewMode);
    setTrackerViewSort(initialValues.trackerViewSort);
    setDashboardTrackersPagination(initialValues.dashboardTrackersPagination);
    setErrors({});
  };
  const validations = {
    language: [],
    trackerAutoStart: [],
    trackerStopOnNewStart: [],
    trackerViewMode: [],
    trackerViewSort: [],
    dashboardTrackersPagination: [],
  };
  const runValidationTasks = async (fieldName, value) => {
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          language,
          trackerAutoStart,
          trackerStopOnNewStart,
          trackerViewMode,
          trackerViewSort,
          dashboardTrackersPagination,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          await DataStore.save(new UserSetting(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...rest}
      {...getOverrideProps(overrides, "UserSettingCreateForm")}
    >
      <SelectField
        label="Language"
        placeholder="Please select an option"
        isDisabled={false}
        value={language}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              language: value,
              trackerAutoStart,
              trackerStopOnNewStart,
              trackerViewMode,
              trackerViewSort,
              dashboardTrackersPagination,
            };
            const result = onChange(modelFields);
            value = result?.language ?? value;
          }
          if (errors.language?.hasError) {
            runValidationTasks("language", value);
          }
          setLanguage(value);
        }}
        onBlur={() => runValidationTasks("language", language)}
        errorMessage={errors.language?.errorMessage}
        hasError={errors.language?.hasError}
        {...getOverrideProps(overrides, "language")}
      >
        <option
          children="It"
          value="IT"
          {...getOverrideProps(overrides, "languageoption0")}
        ></option>
        <option
          children="En"
          value="EN"
          {...getOverrideProps(overrides, "languageoption1")}
        ></option>
      </SelectField>
      <SwitchField
        label="Tracker auto start"
        defaultChecked={false}
        isDisabled={false}
        isChecked={trackerAutoStart}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              language,
              trackerAutoStart: value,
              trackerStopOnNewStart,
              trackerViewMode,
              trackerViewSort,
              dashboardTrackersPagination,
            };
            const result = onChange(modelFields);
            value = result?.trackerAutoStart ?? value;
          }
          if (errors.trackerAutoStart?.hasError) {
            runValidationTasks("trackerAutoStart", value);
          }
          setTrackerAutoStart(value);
        }}
        onBlur={() => runValidationTasks("trackerAutoStart", trackerAutoStart)}
        errorMessage={errors.trackerAutoStart?.errorMessage}
        hasError={errors.trackerAutoStart?.hasError}
        {...getOverrideProps(overrides, "trackerAutoStart")}
      ></SwitchField>
      <SwitchField
        label="Tracker stop on new start"
        defaultChecked={false}
        isDisabled={false}
        isChecked={trackerStopOnNewStart}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              language,
              trackerAutoStart,
              trackerStopOnNewStart: value,
              trackerViewMode,
              trackerViewSort,
              dashboardTrackersPagination,
            };
            const result = onChange(modelFields);
            value = result?.trackerStopOnNewStart ?? value;
          }
          if (errors.trackerStopOnNewStart?.hasError) {
            runValidationTasks("trackerStopOnNewStart", value);
          }
          setTrackerStopOnNewStart(value);
        }}
        onBlur={() =>
          runValidationTasks("trackerStopOnNewStart", trackerStopOnNewStart)
        }
        errorMessage={errors.trackerStopOnNewStart?.errorMessage}
        hasError={errors.trackerStopOnNewStart?.hasError}
        {...getOverrideProps(overrides, "trackerStopOnNewStart")}
      ></SwitchField>
      <SelectField
        label="Tracker view mode"
        placeholder="Please select an option"
        isDisabled={false}
        value={trackerViewMode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              language,
              trackerAutoStart,
              trackerStopOnNewStart,
              trackerViewMode: value,
              trackerViewSort,
              dashboardTrackersPagination,
            };
            const result = onChange(modelFields);
            value = result?.trackerViewMode ?? value;
          }
          if (errors.trackerViewMode?.hasError) {
            runValidationTasks("trackerViewMode", value);
          }
          setTrackerViewMode(value);
        }}
        onBlur={() => runValidationTasks("trackerViewMode", trackerViewMode)}
        errorMessage={errors.trackerViewMode?.errorMessage}
        hasError={errors.trackerViewMode?.hasError}
        {...getOverrideProps(overrides, "trackerViewMode")}
      >
        <option
          children="Card"
          value="CARD"
          {...getOverrideProps(overrides, "trackerViewModeoption0")}
        ></option>
        <option
          children="Grid"
          value="GRID"
          {...getOverrideProps(overrides, "trackerViewModeoption1")}
        ></option>
      </SelectField>
      <SelectField
        label="Tracker view sort"
        placeholder="Please select an option"
        isDisabled={false}
        value={trackerViewSort}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              language,
              trackerAutoStart,
              trackerStopOnNewStart,
              trackerViewMode,
              trackerViewSort: value,
              dashboardTrackersPagination,
            };
            const result = onChange(modelFields);
            value = result?.trackerViewSort ?? value;
          }
          if (errors.trackerViewSort?.hasError) {
            runValidationTasks("trackerViewSort", value);
          }
          setTrackerViewSort(value);
        }}
        onBlur={() => runValidationTasks("trackerViewSort", trackerViewSort)}
        errorMessage={errors.trackerViewSort?.errorMessage}
        hasError={errors.trackerViewSort?.hasError}
        {...getOverrideProps(overrides, "trackerViewSort")}
      >
        <option
          children="Created at"
          value="CREATED_AT"
          {...getOverrideProps(overrides, "trackerViewSortoption0")}
        ></option>
        <option
          children="Updated at"
          value="UPDATED_AT"
          {...getOverrideProps(overrides, "trackerViewSortoption1")}
        ></option>
      </SelectField>
      <SelectField
        label="Dashboard trackers pagination"
        placeholder="Please select an option"
        isDisabled={false}
        value={dashboardTrackersPagination}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              language,
              trackerAutoStart,
              trackerStopOnNewStart,
              trackerViewMode,
              trackerViewSort,
              dashboardTrackersPagination: value,
            };
            const result = onChange(modelFields);
            value = result?.dashboardTrackersPagination ?? value;
          }
          if (errors.dashboardTrackersPagination?.hasError) {
            runValidationTasks("dashboardTrackersPagination", value);
          }
          setDashboardTrackersPagination(value);
        }}
        onBlur={() =>
          runValidationTasks(
            "dashboardTrackersPagination",
            dashboardTrackersPagination
          )
        }
        errorMessage={errors.dashboardTrackersPagination?.errorMessage}
        hasError={errors.dashboardTrackersPagination?.hasError}
        {...getOverrideProps(overrides, "dashboardTrackersPagination")}
      >
        <option
          children="Three"
          value="THREE"
          {...getOverrideProps(overrides, "dashboardTrackersPaginationoption0")}
        ></option>
        <option
          children="Seven"
          value="SEVEN"
          {...getOverrideProps(overrides, "dashboardTrackersPaginationoption1")}
        ></option>
      </SelectField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={resetStateValues}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Cancel"
            type="button"
            onClick={() => {
              onCancel && onCancel();
            }}
            {...getOverrideProps(overrides, "CancelButton")}
          ></Button>
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
