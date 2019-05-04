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
      values: []
    }
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
      console.log(myJson);
    });

    this.setState({
      files: files.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    });
  }

  render() {
    var image = new Image();
    //image.src = 'data:image/jpg;base64,' + values;
    image.src = values;
    document.body.appendChild(image);
    const {files, values} = this.state;
    console.log (values);
    //console.log(image);

    return (
      <div className="App">
      <h1>{values.toString()}</h1>
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
