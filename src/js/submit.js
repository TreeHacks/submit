import React from 'react';
import Form from "react-jsonschema-form";

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
    "ui:widget": "textarea",
    "ui:placeholder":
      "Your team members' names separated by commas"
  },
  link: {
    "ui:placeholder":
      "Link to devpost project"
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
              Open <a href="devpost.com">devpost.com</a> and make a submission.
            </p>
          <h2>Step 2</h2>
          <SubmitForm />
          <h2>Step 3</h2>
            <p>
              Check back on <a href="#">something.treehacks.com</a> for your table number!
            </p>
        </div>
      </div>
    );
  }
}

class SubmitForm extends React.Component {
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
