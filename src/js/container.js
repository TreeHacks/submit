import React, { useCallback } from "react";
import Form from "react-jsonschema-form";
import API from "@aws-amplify/api";
import { useState, useEffect } from "react";
import Loading from "./Loading";

import TeamSelect from "./teamselect";
import Submit from "./submit";

const Container = (user) => {
    const username = user.user.username;
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const data = await API.get(
                    "treehacks",
                    `/users/${username}/teams/team`
                );
                console.log("DATA");
                console.log(data);
                setTeam(data.data);
            } catch (e) {
                console.error(e);
                console.log(e);
                setError(true);
            }
            setLoading(false);
        }
        fetchData();
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
    return (
        <div>
            {team && <Submit user={user} setTeam={setTeam}/>}
            {!team && <TeamSelect user={user} setTeam={setTeam} />}
        </div>
    );
};

export default Container;
