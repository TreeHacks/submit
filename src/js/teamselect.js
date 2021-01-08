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

const TeamSelect = ({ user, setTeam }) => {
    const username = user.user.username;
    const [profile, setProfile] = useState(null);
    const [submitInfo, setSubmitInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const submitForm = useCallback((data) => {
        async function submit(body) {
            setLoading(true);
            try {
                const data = await API.post(
                    "treehacks",
                    `/users/${username}/teams/join`,
                    { body: body }
                );
                setLoading(false);
                setTeam(data.data);
            } catch (e) {
                console.error(e);
                alert("Sorry, there was an error submitting.");
            }
            setLoading(false);
        }
        submit(data);
    }, []);
    async function createTeam(username, setTeam) {
        setLoading(true);
        try {
            const data = await API.post(
                "treehacks",
                `/users/${username}/teams/create`
            );
            setLoading(false);
            setTeam(data.data);
        } catch (e) {
            console.error(e);
            alert("Sorry, there was an error submitting.");
        }
        setLoading(false);
    }

    if (loading) {
        return <Loading />;
    }
    return (
        <div id="submit">
            <div className="content">
                <div className="section">
                    <h2>Create Team</h2>
                    <button
                        className="btn btn-info"
                        onClick={() => createTeam(username, setTeam)}
                    >
                        Create
                    </button>
                </div>
                <div>or</div>
                <div className="section">
                    <h2>Join Team</h2>
                    <div class="form">
                        <Form
                            schema={formSchema}
                            uiSchema={uiSchema}
                            showErrorList={false}
                            // onChange={e => setSubmitInfo(e.formData)}
                            onSubmit={(e) => submitForm(e.formData)}
                        >
                            <button type="submit" className="btn btn-info">
                                Submit
                            </button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamSelect;
