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
      values: [],
      average: 0,
      deviation: 0,
      sum:0
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
      return response.json()
      //console.log(response.body.json());
    })
    .then((myJson) => {
      console.log(myJson)
      this.setState({ values: myJson })
      var currentsum = 0
      myJson.forEach(value => {
        currentsum+=value
      })
      var standarDiv = 0
      var all = []
      var averageOfDatabase =0;

      firebase.database().ref('distance').once('value').then(snapshot => {
        var databasesum = snapshot.val().sum
        var databasetotal = snapshot.val().total
        firebase.database().ref('distance').set({
          total: databasetotal+1,
          sum: databasesum+currentsum
        })
        averageOfDatabase = (databasesum+currentsum) /(databasetotal+1)
        firebase.database().ref('all').once('value').then(snapshot => {
          for (var key in snapshot.val()){
            standarDiv += Math.pow(snapshot.val()[key]-averageOfDatabase,2)
          }
          standarDiv = standarDiv / databasetotal
          this.setState({average: averageOfDatabase, deviation: standarDiv, sum:currentsum})
        })
        })
        firebase.database().ref('all').push(currentsum)
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
    //console.log (files);
    //console.log(image);

    return (
      <div className="App" id="header">
      <a id="logo">Average Face Analyzer</a>
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
        <h1>Your Number: {parseInt(this.state.sum)}</h1>
        <h1>The Average Is: {this.state.average}</h1>
        <h1>You are {(this.state.average-this.state.sum)/this.state.deviation} Standard Deviations away from average</h1>
      </div>
    );
  }
}

export default App;
