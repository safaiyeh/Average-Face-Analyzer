import classNames from 'classnames';
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './App.css';
import firebase from 'firebase'

// TODO: Move uploader to its own component
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      values: []
    }
    
    var firebaseConfig = {
      apiKey: "AIzaSyDlGTPTdJbPAMfYU3tDae4xyQPa2Ib9hV8",
      authDomain: "cs161-faceid.firebaseapp.com",
      databaseURL: "https://cs161-faceid.firebaseio.com",
      projectId: "cs161-faceid",
      storageBucket: "cs161-faceid.appspot.com",
    };
    firebase.initializeApp(firebaseConfig)
  }

  onDrop = (files) => {
    var formData = new FormData();
    formData.append('the_file', files[0]);

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    }).then((response) => {
      return response.json();
      //console.log(response.body.json());
    })
    .then((myJson) => {
      this.setState({ values: myJson })
      var currentsum = 0
      myJson.forEach(value => {
        currentsum+=value
      })
      firebase.database().ref('distance').once('value').then(snapshot => {
        var newsum = snapshot.val().sum
        var newtotal = snapshot.val().total
        firebase.database().ref('distance').set({
          total: newtotal+1,
          sum: newsum+currentsum
        })
        var averageOfDatabase = (newsum+currentsum) /(newtotal+1)
        })
    });

    this.setState({
      files: files.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    });
  }

  render() {
    //var image = new Image();
    //image.src = 'data:image/jpg;base64,' + values;
    //image.src = values;
    //document.body.appendChild(image);
    const {files, values} = this.state;
    console.log (files);
    //console.log(image);

    return (
      <div className="App" id="header">
      <a id="logo">Average Face Analyzer</a>
      <h1>{values.toString()}</h1>
      <Dropzone onDrop={this.onDrop}>
        {({getRootProps, getInputProps, isDragActive}) => {
          return (
            <div
              {...getRootProps()}
              className={classNames('dropzone', {'dropzone--isActive': isDragActive})}
            >
              <input {...getInputProps()} />
              <ul id="menu">
              {
                isDragActive ?
                  <li><a><span>Drop files here...</span></a></li> :
                  <li><a><span>Click Here or drag your image!</span></a></li>
              }
              </ul>
            </div>
          )
        }}
      </Dropzone>
      {
        files.map(file => (
          <img
            src={file.preview}
          />
        ))}
      </div>
    );
  }
}

export default App;
