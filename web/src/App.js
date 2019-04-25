import classNames from 'classnames';
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './App.css';

// TODO: Move uploader to its own component
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      values: 'hi'
    }
  }

  onDrop = (files) => {
    var formData = new FormData();
    formData.append('the_file', files[0]);

    fetch('http://localhost:5000/upload', {
    //fetch('https://average-face-analyzer.herokuapp.com/upload', {
      method: 'POST',
      body: formData
    }).then(function(response) {
      console.log('hello');
      return response.json();
    })
    .then(function(myJson) {
      console.log(myJson);
      this.setState({ values: 'got it' })
    });

    this.setState({
      files: files.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    });
  }

  render() {
    const {files, values} = this.state;

    return (
      <div className="App">
      <h1>{values}</h1>
      <Dropzone onDrop={this.onDrop}>
        {({getRootProps, getInputProps, isDragActive}) => {
          return (
            <div
              {...getRootProps()}
              className={classNames('dropzone', {'dropzone--isActive': isDragActive})}
            >
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p>Drop files here...</p> :
                  <p>Try dropping some files here, or click to select files to upload.</p>
              }
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
