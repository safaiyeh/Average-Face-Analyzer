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
    }
  }

  onDrop = (files) => {
    var formData = new FormData();
    formData.append('the_file', files[0]);

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    })

    this.setState({
      files: files.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    });
  }

  render() {
    const {files} = this.state;

    return (
      <div className="App">
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
