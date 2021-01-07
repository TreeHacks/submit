import React, { useCallback } from "react";
import Form from "react-jsonschema-form";
import API from "@aws-amplify/api";
import { useState, useEffect } from "react";
import Loading from "./Loading";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { CHALLENGE_OPTIONS, PRIZE_OPTIONS } from "./constants";

const formSchema = {
    required: [],
    title: "",
    type: "object",
    properties: {
        code: { type: "string", title: "Team code" },
    },
};

const uiSchema = {
    code: {
        "ui:placeholder": "Team Code",
    },
};

const TeamSelect = (user) => {
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
                const submitInfo = await API.get(
                    "treehacks",
                    `/users/${username}/forms/submit_info`
                );
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
            } catch (e) {
                console.error(e);
                alert("Sorry, there was an error submitting.");
            }
            setLoading(false);
        }
        submit(data);
    }, []);
    if (error) {
        return (
            <div id="submit">
                <div className="content">Sorry, there was an error.</div>
            </div>
        );
    }
    if (loading) {
        return <Loading />;
    }
    const defaultSubmitInfo =
        profile && profile.first_name && profile.last_name
            ? {
                  members: [profile.first_name + " " + profile.last_name],
              }
            : {};
    const submitted =
        submitInfo &&
        submitInfo.members &&
        submitInfo.members.length &&
        submitInfo.url;
    return (
        <div id="submit">
            <div className="content">
                <div className="section">
                    <h2>Create Team</h2>
                    <button className="btn btn-info">Create</button>
                </div>
                <div>or</div>
                <div className="section">
                    <h2>Join Team</h2>
                    <div class="form">
                        <Form
                            schema={formSchema}
                            uiSchema={uiSchema}
                            showErrorList={false}
                            formData={
                                submitted ? submitInfo : defaultSubmitInfo
                            }
                            // onChange={e => setSubmitInfo(e.formData)}
                            onSubmit={(e) => submitForm(e.formData)}
                        >
                            <button type="submit" className="btn btn-info">
                                {submitted
                                    ? "You've already submitted! Click here to update your submission."
                                    : "Submit"}
                            </button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamSelect;
