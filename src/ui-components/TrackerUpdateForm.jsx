/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { fetchByPath, validateField } from "./utils";
import { Tracker } from "../models";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import {
  Button,
  Flex,
  Grid,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { DataStore } from "aws-amplify";
export default function TrackerUpdateForm(props) {
  const {
    id,
    tracker,
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
    title: undefined,
    logDescription: undefined,
    startedAt: undefined,
    state: undefined,
    ttid: undefined,
    logServiceObject: undefined,
    favorite: false,
  };
  const [title, setTitle] = React.useState(initialValues.title);
  const [logDescription, setLogDescription] = React.useState(
    initialValues.logDescription
  );
  const [startedAt, setStartedAt] = React.useState(initialValues.startedAt);
  const [state, setState] = React.useState(initialValues.state);
  const [ttid, setTtid] = React.useState(initialValues.ttid);
  const [logServiceObject, setLogServiceObject] = React.useState(
    initialValues.logServiceObject
      ? JSON.stringify(initialValues.logServiceObject)
      : undefined
  );
  const [favorite, setFavorite] = React.useState(initialValues.favorite);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = { ...initialValues, ...trackerRecord };
    setTitle(cleanValues.title);
    setLogDescription(cleanValues.logDescription);
    setStartedAt(cleanValues.startedAt);
    setState(cleanValues.state);
    setTtid(cleanValues.ttid);
    setLogServiceObject(
      typeof cleanValues.logServiceObject === "string"
        ? cleanValues.logServiceObject
        : JSON.stringify(cleanValues.logServiceObject)
    );
    setFavorite(cleanValues.favorite);
    setErrors({});
  };
  const [trackerRecord, setTrackerRecord] = React.useState(tracker);
  React.useEffect(() => {
    const queryData = async () => {
      const record = id ? await DataStore.query(Tracker, id) : tracker;
      setTrackerRecord(record);
    };
    queryData();
  }, [id, tracker]);
  React.useEffect(resetStateValues, [trackerRecord]);
  const validations = {
    title: [{ type: "Required" }],
    logDescription: [],
    startedAt: [],
    state: [{ type: "Required" }],
    ttid: [],
    logServiceObject: [{ type: "JSON" }],
    favorite: [],
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
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hour12: false,
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
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
          title,
          logDescription,
          startedAt,
          state,
          ttid,
          logServiceObject,
          favorite,
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
          await DataStore.save(
            Tracker.copyOf(trackerRecord, (updated) => {
              Object.assign(updated, modelFields);
            })
          );
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...rest}
      {...getOverrideProps(overrides, "TrackerUpdateForm")}
    >
      <TextField
        label="Title"
        isRequired={true}
        isReadOnly={false}
        defaultValue={title}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title: value,
              logDescription,
              startedAt,
              state,
              ttid,
              logServiceObject,
              favorite,
            };
            const result = onChange(modelFields);
            value = result?.title ?? value;
          }
          if (errors.title?.hasError) {
            runValidationTasks("title", value);
          }
          setTitle(value);
        }}
        onBlur={() => runValidationTasks("title", title)}
        errorMessage={errors.title?.errorMessage}
        hasError={errors.title?.hasError}
        {...getOverrideProps(overrides, "title")}
      ></TextField>
      <TextField
        label="Log description"
        isRequired={false}
        isReadOnly={false}
        defaultValue={logDescription}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              logDescription: value,
              startedAt,
              state,
              ttid,
              logServiceObject,
              favorite,
            };
            const result = onChange(modelFields);
            value = result?.logDescription ?? value;
          }
          if (errors.logDescription?.hasError) {
            runValidationTasks("logDescription", value);
          }
          setLogDescription(value);
        }}
        onBlur={() => runValidationTasks("logDescription", logDescription)}
        errorMessage={errors.logDescription?.errorMessage}
        hasError={errors.logDescription?.hasError}
        {...getOverrideProps(overrides, "logDescription")}
      ></TextField>
      <TextField
        label="Started at"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        defaultValue={startedAt && convertToLocal(new Date(startedAt))}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              logDescription,
              startedAt: value,
              state,
              ttid,
              logServiceObject,
              favorite,
            };
            const result = onChange(modelFields);
            value = result?.startedAt ?? value;
          }
          if (errors.startedAt?.hasError) {
            runValidationTasks("startedAt", value);
          }
          setStartedAt(new Date(value).toISOString());
        }}
        onBlur={() => runValidationTasks("startedAt", startedAt)}
        errorMessage={errors.startedAt?.errorMessage}
        hasError={errors.startedAt?.hasError}
        {...getOverrideProps(overrides, "startedAt")}
      ></TextField>
      <SelectField
        label="State"
        placeholder="Please select an option"
        isDisabled={false}
        value={state}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              logDescription,
              startedAt,
              state: value,
              ttid,
              logServiceObject,
              favorite,
            };
            const result = onChange(modelFields);
            value = result?.state ?? value;
          }
          if (errors.state?.hasError) {
            runValidationTasks("state", value);
          }
          setState(value);
        }}
        onBlur={() => runValidationTasks("state", state)}
        errorMessage={errors.state?.errorMessage}
        hasError={errors.state?.hasError}
        {...getOverrideProps(overrides, "state")}
      >
        <option
          children="Stop"
          value="STOP"
          {...getOverrideProps(overrides, "stateoption0")}
        ></option>
        <option
          children="Start"
          value="START"
          {...getOverrideProps(overrides, "stateoption1")}
        ></option>
        <option
          children="Pause"
          value="PAUSE"
          {...getOverrideProps(overrides, "stateoption2")}
        ></option>
      </SelectField>
      <TextField
        label="Ttid"
        isRequired={false}
        isReadOnly={false}
        defaultValue={ttid}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              logDescription,
              startedAt,
              state,
              ttid: value,
              logServiceObject,
              favorite,
            };
            const result = onChange(modelFields);
            value = result?.ttid ?? value;
          }
          if (errors.ttid?.hasError) {
            runValidationTasks("ttid", value);
          }
          setTtid(value);
        }}
        onBlur={() => runValidationTasks("ttid", ttid)}
        errorMessage={errors.ttid?.errorMessage}
        hasError={errors.ttid?.hasError}
        {...getOverrideProps(overrides, "ttid")}
      ></TextField>
      <TextAreaField
        label="Log service object"
        isRequired={false}
        isReadOnly={false}
        defaultValue={logServiceObject}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              logDescription,
              startedAt,
              state,
              ttid,
              logServiceObject: value,
              favorite,
            };
            const result = onChange(modelFields);
            value = result?.logServiceObject ?? value;
          }
          if (errors.logServiceObject?.hasError) {
            runValidationTasks("logServiceObject", value);
          }
          setLogServiceObject(value);
        }}
        onBlur={() => runValidationTasks("logServiceObject", logServiceObject)}
        errorMessage={errors.logServiceObject?.errorMessage}
        hasError={errors.logServiceObject?.hasError}
        {...getOverrideProps(overrides, "logServiceObject")}
      ></TextAreaField>
      <SwitchField
        label="Favorite"
        defaultChecked={false}
        isDisabled={false}
        isChecked={favorite}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              title,
              logDescription,
              startedAt,
              state,
              ttid,
              logServiceObject,
              favorite: value,
            };
            const result = onChange(modelFields);
            value = result?.favorite ?? value;
          }
          if (errors.favorite?.hasError) {
            runValidationTasks("favorite", value);
          }
          setFavorite(value);
        }}
        onBlur={() => runValidationTasks("favorite", favorite)}
        errorMessage={errors.favorite?.errorMessage}
        hasError={errors.favorite?.hasError}
        {...getOverrideProps(overrides, "favorite")}
      ></SwitchField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={resetStateValues}
          {...getOverrideProps(overrides, "ResetButton")}
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
