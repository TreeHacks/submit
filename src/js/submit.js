import React from 'react';

class Submit extends React.Component {
  render() {
    return (
      <div id="submit">
        <div className="content">
          <h1>Steps to submit</h1>
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
      <form>
        <p>
          Put your teammates' names here (separated by commas):
        </p>
        <NameInput />
        <p>
          And paste the devpost link here:
        </p>
        <LinkInput />
        <br></br>
        <button className="main-button">Submit</button>
      </form>
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
