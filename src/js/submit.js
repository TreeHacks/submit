import React from 'react';
import Form from "react-jsonschema-form";
import API from "@aws-amplify/api";

const formSchema = {
  required: [],
  title: "Fill out project info:",
  type: "object",
  properties: {
    teamnames: { type: "string", title: "Team names" },
    link: { type: "string", title: "Link" },
  }
};

const uiSchema = {
  teamnames: {
    "ui:placeholder":
      "Your team members' names separated by commas",
    "ui:widget": "textarea"
  },
  link: {
    "ui:placeholder":
      "Paste link to devpost project"
  }
};

const log = type => console.log.bind(console, type);

class Submit extends React.Component {
  render() {
    return (
      <div id="submit">
        <div className="content">
          <h1>Submit your project here!</h1>
          <h2>Step 1</h2>
            <p>
              Open <a href="https://treehacks-2020.devpost.com" target="_blank">Devpost</a> and make a submission.
            </p>
          <h2>Step 2</h2>
          <SubmitForm />
          <h2>Step 3</h2>
            <p>
              Check back on <a href="https://expo.treehacks.com" target="_blank">expo.treehacks.com</a> for your table number!
            </p>
        </div>
      </div>
    );
  }
}

class SubmitForm extends React.Component {
  async submitForm(e) {
    const form = { body: e.formData };
    console.log("Data submitted: ", form);
    const resp = await API.put(
      "treehacks",
      `/users/${this.props.user.username}/forms/meet_info`,
      form
    );
    console.log(resp);
    this.setState({ redirect: true });
  }

  render() {
    return (
      <div class="form">
        <Form
          schema={formSchema}
          uiSchema={uiSchema}
          onChange={log("changed")}
          onSubmit={e => this.submitForm(e)}
          onError={log("errors")}
        />
      </div>
    );
  }
}

class NameInput extends React.Component {
  render() {
    return (
      <input type="text" name="names"></input>
    );
  }
}

class LinkInput extends React.Component {
  render() {
    return (
      <input type="text" name="link"></input>
    );
  }
}

export default Submit;
