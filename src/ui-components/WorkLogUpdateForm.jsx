/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { fetchByPath, validateField } from "./utils";
import { WorkLog } from "../models";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import {
  Button,
  Flex,
  Grid,
  SelectField,
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { DataStore } from "aws-amplify";
export default function WorkLogUpdateForm(props) {
  const {
    id,
    workLog,
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
    description: undefined,
    startedAt: undefined,
    endedAt: undefined,
    ttid: undefined,
    logServiceObject: undefined,
    state: undefined,
  };
  const [title, setTitle] = React.useState(initialValues.title);
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [startedAt, setStartedAt] = React.useState(initialValues.startedAt);
  const [endedAt, setEndedAt] = React.useState(initialValues.endedAt);
  const [ttid, setTtid] = React.useState(initialValues.ttid);
  const [logServiceObject, setLogServiceObject] = React.useState(
    initialValues.logServiceObject
      ? JSON.stringify(initialValues.logServiceObject)
      : undefined
  );
  const [state, setState] = React.useState(initialValues.state);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = { ...initialValues, ...workLogRecord };
    setTitle(cleanValues.title);
    setDescription(cleanValues.description);
    setStartedAt(cleanValues.startedAt);
    setEndedAt(cleanValues.endedAt);
    setTtid(cleanValues.ttid);
    setLogServiceObject(
      typeof cleanValues.logServiceObject === "string"
        ? cleanValues.logServiceObject
        : JSON.stringify(cleanValues.logServiceObject)
    );
    setState(cleanValues.state);
    setErrors({});
  };
  const [workLogRecord, setWorkLogRecord] = React.useState(workLog);
  React.useEffect(() => {
    const queryData = async () => {
      const record = id ? await DataStore.query(WorkLog, id) : workLog;
      setWorkLogRecord(record);
    };
    queryData();
  }, [id, workLog]);
  React.useEffect(resetStateValues, [workLogRecord]);
  const validations = {
    title: [{ type: "Required" }],
    description: [],
    startedAt: [{ type: "Required" }],
    endedAt: [{ type: "Required" }],
    ttid: [],
    logServiceObject: [{ type: "JSON" }],
    state: [{ type: "Required" }],
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
          description,
          startedAt,
          endedAt,
          ttid,
          logServiceObject,
          state,
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
            WorkLog.copyOf(workLogRecord, (updated) => {
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
      {...getOverrideProps(overrides, "WorkLogUpdateForm")}
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
              description,
              startedAt,
              endedAt,
              ttid,
              logServiceObject,
              state,
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
        label="Description"
        isRequired={false}
        isReadOnly={false}
        defaultValue={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              description: value,
              startedAt,
              endedAt,
              ttid,
              logServiceObject,
              state,
            };
            const result = onChange(modelFields);
            value = result?.description ?? value;
          }
          if (errors.description?.hasError) {
            runValidationTasks("description", value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks("description", description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, "description")}
      ></TextField>
      <TextField
        label="Started at"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        defaultValue={startedAt && convertToLocal(new Date(startedAt))}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              description,
              startedAt: value,
              endedAt,
              ttid,
              logServiceObject,
              state,
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
      <TextField
        label="Ended at"
        isRequired={true}
        isReadOnly={false}
        type="datetime-local"
        defaultValue={endedAt && convertToLocal(new Date(endedAt))}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              title,
              description,
              startedAt,
              endedAt: value,
              ttid,
              logServiceObject,
              state,
            };
            const result = onChange(modelFields);
            value = result?.endedAt ?? value;
          }
          if (errors.endedAt?.hasError) {
            runValidationTasks("endedAt", value);
          }
          setEndedAt(new Date(value).toISOString());
        }}
        onBlur={() => runValidationTasks("endedAt", endedAt)}
        errorMessage={errors.endedAt?.errorMessage}
        hasError={errors.endedAt?.hasError}
        {...getOverrideProps(overrides, "endedAt")}
      ></TextField>
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
              description,
              startedAt,
              endedAt,
              ttid: value,
              logServiceObject,
              state,
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
              description,
              startedAt,
              endedAt,
              ttid,
              logServiceObject: value,
              state,
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
              description,
              startedAt,
              endedAt,
              ttid,
              logServiceObject,
              state: value,
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
          children="Pending"
          value="PENDING"
          {...getOverrideProps(overrides, "stateoption0")}
        ></option>
        <option
          children="Logged"
          value="LOGGED"
          {...getOverrideProps(overrides, "stateoption1")}
        ></option>
        <option
          children="Deleted"
          value="DELETED"
          {...getOverrideProps(overrides, "stateoption2")}
        ></option>
        <option
          children="Merged"
          value="MERGED"
          {...getOverrideProps(overrides, "stateoption3")}
        ></option>
      </SelectField>
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