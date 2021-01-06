import React, { useCallback } from 'react';
import Form from "react-jsonschema-form";
import API from "@aws-amplify/api";
import { useState, useEffect } from 'react';
import Loading from './Loading';
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { CHALLENGE_OPTIONS, PRIZE_OPTIONS } from "./constants";

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

const ChallengeMultiSelect = ({ formData, uiSchema, onChange }) => {
  return (<>
    <label>Applicable Challenges (optional)</label>
    <Select
      isMulti
      placeholder={uiSchema["ui:placeholder"]}
      onChange={e => onChange((e || []).map(item => item.value))}
      value={(formData || []).map(e => ({ value: e, label: e }))}
      options={CHALLENGE_OPTIONS}
      formatCreateLabel={e => `${e}`}
      noOptionsMessage={() => null}
    />
  </>);
}

const PrizeMultiSelect = ({ formData, uiSchema, onChange }) => {
  return (<>
    <label>Applicable Sponsor Prizes (optional)</label>
    <Select
      isMulti
      placeholder={uiSchema["ui:placeholder"]}
      onChange={e => onChange((e || []).map(item => item.value))}
      value={(formData || []).map(e => ({ value: e, label: e }))}
      options={PRIZE_OPTIONS}
      formatCreateLabel={e => `${e}`}
      noOptionsMessage={() => null}
    />
  </>);
}

const TechMultiSelect = ({ formData, uiSchema, onChange }) => {
  return (<>
    <label>Technologies Used (optional)</label>
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
    name: { type: "string", title: "Project name" },
    description: { type: "string", title: "Project description" },
    members: { type: "array", title: "Team names", items: { type: "string" } },
    challenges: { type: "array", title: "Challenges", items: { type: "string" } },
    prizes: { type: "array", title: "Prizes", items: { type: "string" } },
    technologies: { type: "array", title: "Prizes", items: { type: "string" } },
    // url: { type: "string", title: "Devpost Link" },
  },
  required: ["members", "url"]
};

const uiSchema = {
  name: {
    "ui:placeholder":
        "Project name"
  },
  description: {
    "ui:widget": "textarea",
    "ui:placeholder":
        "Project description (<= 5 sentences is okay!)"
  },
  challenges: {
    "ui:field": "treehacks:challengeselect"
  },
  prizes: {
    "ui:field": "treehacks:prizeselect"
  },
  technologies: {
    "ui:placeholder": "Select or type...",
    "ui:field": "treehacks:techselect"
  },
  members: {
    "ui:placeholder": "Select or type...",
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
        <h1>Register your project here!</h1>
        <div class="form">
          <Form
            schema={formSchema}
            uiSchema={uiSchema}
            showErrorList={false}
            formData={submitted ? submitInfo : defaultSubmitInfo}
            // onChange={e => setSubmitInfo(e.formData)}
            onSubmit={e => submitForm(e.formData)}
            fields={{ "treehacks:multiselect": MultiselectField, 
                      "treehacks:challengeselect": ChallengeMultiSelect,
                      "treehacks:prizeselect": PrizeMultiSelect,
                      "treehacks:techselect": TechMultiSelect  }}
          >
            <button type="submit" className="btn btn-info">{submitted ? "You've already submitted! Click here to update your submission." : "Submit"}</button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Submit;
