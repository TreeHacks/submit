import React, { useCallback } from 'react';
import Form from "react-jsonschema-form";
import API from "@aws-amplify/api";
import { useState, useEffect } from 'react';
import Loading from './Loading';
import CreatableSelect from "react-select/creatable";

const MultiselectField = ({ formData, uiSchema, onChange }) => {
  return (<>
    <label>Team member names (first and last)</label>
    <CreatableSelect
      isMulti
      placeholder={uiSchema["ui:placeholder"]}
      onChange={e => onChange((e || []).map(item => item.value))}
      value={(formData || []).map(e => ({ value: e, label: e }))}
      options={[]}
      formatCreateLabel={e => `${e}`}
      noOptionsMessage={() => null}
    />
  </>);
}

const formSchema = {
  required: [],
  title: "Fill out project info:",
  type: "object",
  properties: {
    members: { type: "array", title: "Team names", items: { type: "string" } },
    url: { type: "string", format: "url", title: "Devpost Link" },
  },
  required: ["members", "url"]
};

const uiSchema = {
  members: {
    "ui:field": "treehacks:multiselect"
  },
  url: {
    "ui:placeholder":
      "Paste link to Devpost project"
  }
};

const Submit = (user) => {
  const username = user.user.username;
  const [profile, setProfile] = useState(null);
  const [submitInfo, setSubmitInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const profile = await API.get("treehacks", `/user_profile`);
        const submitInfo = await API.get("treehacks", `/users/${username}/forms/submit_info`);
        setProfile(profile);
        if (submitInfo) {
          setSubmitInfo(submitInfo);
        }
      } catch (e) {
        console.error(e);
        setError(true);
      }
      setLoading(false);
    }
    fetchData();
  }, []);
  const submitForm = useCallback((data) => {
    async function submit(body) {
      setLoading(true);
      try {
        await API.put(
          "treehacks",
          `/users/${username}/forms/submit_info`,
          { body: body }
        );
        setSubmitInfo(body);
      } catch(e) {
        console.error(e);
        alert("Sorry, there was an error submitting.");
      }
      setLoading(false);
    };
    submit(data);
  }, []);
  if (error) {
    return <div id="submit"><div className="content">Sorry, there was an error.</div></div>;
  }
  if (loading) {
    return <Loading />;
  }
  const defaultSubmitInfo = (profile && profile.first_name && profile.last_name) ? {
    members: [profile.first_name + " " + profile.last_name]
  }: {};
  const submitted = submitInfo && submitInfo.members && submitInfo.members.length && submitInfo.url;
  return (
    <div id="submit">
      <div className="content">
        <h1>Submit your project here!</h1>
        <h2>Step 1</h2>
        <p>
          Open <a href="https://treehacks-2020.devpost.com" target="_blank">Devpost</a> and make a submission.
            </p>
        <h2>Step 2</h2>
        <div class="form">
          <Form
            schema={formSchema}
            uiSchema={uiSchema}
            showErrorList={false}
            formData={submitInfo ? submitInfo : defaultSubmitInfo}
            // onChange={e => setSubmitInfo(e.formData)}
            onSubmit={e => submitForm(e.formData)}
            fields={{ "treehacks:multiselect": MultiselectField }}
          >
            <button type="submit" className="btn btn-info">{submitted ? "You've already submitted! Click here to update your submission." : "Submit"}</button>
          </Form>
        </div>
        <h2>Step 3</h2>
        <p>
          Check back on <a href="https://expo.treehacks.com" target="_blank">expo.treehacks.com</a> for your floor and table number!
            </p>
      </div>
    </div>
  );
};

export default Submit;
