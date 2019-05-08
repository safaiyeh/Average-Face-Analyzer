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
      cv2Image: '',
      average: 0,
      deviation: 0,
      sum:0,
      isLoading: false,
      sex: "",
      age: -1
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
    this.setState({isLoading: true})
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
      this.setState({ values: myJson.data, cv2Image: myJson.photo })
      var currentsum = 0
      myJson.data.forEach(value => {
        currentsum+=value
      })
      var standarDiv = 0
      var all = []
      var averageOfDatabase =0;

      firebase.database().ref(this.state.sex + this.state.age).once('value').then(snapshot => {
        var databasesum = snapshot.val().sum
        var databasetotal = snapshot.val().total
        firebase.database().ref(this.state.sex + this.state.age).set({
          total: databasetotal+1,
          sum: databasesum+currentsum
        })
        averageOfDatabase = (databasesum+currentsum) /(databasetotal+1)
        firebase.database().ref(this.state.sex + this.state.age +'all').once('value').then(snapshot => {
          for (var key in snapshot.val()){
            standarDiv += Math.pow(snapshot.val()[key]-averageOfDatabase,2)
          }
          standarDiv = Math.sqrt(standarDiv / databasetotal)
          this.setState({average: averageOfDatabase, deviation: standarDiv, sum:currentsum,isLoading:false})
        })
        })
        firebase.database().ref(this.state.sex + this.state.age + 'all').push(currentsum)
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
    const {files, values, cv2Image} = this.state;
    //console.log (files);
    //console.log(image);

    return (
      <div className="App" id="header">
      <a id="logo">Average Face Analyzer</a>
<div class="continput">
    <ul>
        <li>
            <input type="radio" name="1" onClick={() => this.setState({sex:"male"})}/>
            <label style={{fontWeight: "bold", fontSize: "20px"}}>Male</label>
            <div class="bullet">
                <div class="line zero"></div>
                <div class="line one"></div>
                <div class="line two"></div>
                <div class="line three"></div>
                <div class="line four"></div>
                <div class="line five"></div>
                <div class="line six"></div>
                <div class="line seven"></div>
            </div>
        </li>
        <li>
            <input type="radio" name="1" onClick={() => this.setState({sex:"female"})}/>
            <label style={{fontWeight: "bold", fontSize: "20px"}}>Female</label>
            <div class="bullet">
                <div class="line zero"></div>
                <div class="line one"></div>
                <div class="line two"></div>
                <div class="line three"></div>
                <div class="line four"></div>
                <div class="line five"></div>
                <div class="line six"></div>
                <div class="line seven"></div>
            </div>
        </li>
    </ul>
    <ul>
        <li>
            <input type="radio" name="2" onClick={() => this.setState({age:"young"})}/>
            <label style={{fontWeight: "bold", fontSize: "20px"}}>18-30</label>
            <div class="bullet">
                <div class="line zero"></div>
                <div class="line one"></div>
                <div class="line two"></div>
                <div class="line three"></div>
                <div class="line four"></div>
                <div class="line five"></div>
                <div class="line six"></div>
                <div class="line seven"></div>
            </div>
        </li>
        <li>
            <input type="radio" name="2" onClick={() => this.setState({age:"middle"})}/>
            <label style={{fontWeight: "bold", fontSize: "20px"}}>31-50</label>
            <div class="bullet">
                <div class="line zero"></div>
                <div class="line one"></div>
                <div class="line two"></div>
                <div class="line three"></div>
                <div class="line four"></div>
                <div class="line five"></div>
                <div class="line six"></div>
                <div class="line seven"></div>
            </div>
        </li>
        <li>
            <input type="radio" name="2" onClick={() => this.setState({age:"old"})}/>
            <label style={{fontWeight: "bold", fontSize: "20px"}}>51+</label>
            <div class="bullet">
                <div class="line zero"></div>
                <div class="line one"></div>
                <div class="line two"></div>
                <div class="line three"></div>
                <div class="line four"></div>
                <div class="line five"></div>
                <div class="line six"></div>
                <div class="line seven"></div>
            </div>
        </li>
    </ul>
    {
        this.state.sex == "" || this.state.age == -1 ? null :
              <Dropzone style={{margin: "auto"}} onDrop={this.onDrop}>
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
      }
</div>     
      {
        files.map(file => (
          <div>
          <img
            src={file.preview}
          />
          {this.state.isLoading ? null :<img src={`data:image/jpeg;base64,${cv2Image.substring(2, cv2Image.length - 1)}`} />}
          </div>
        ))}
        {this.state.isLoading ? 
        <div class="loader">Loading...</div> :
        this.state.sum == 0 ? null:
        <div>
        <h1>Your Number: {parseInt(this.state.sum)}</h1>
        <h1>The Average Is: {parseInt(this.state.average)}</h1>
        <h1>You are {Math.abs((this.state.average-this.state.sum)/this.state.deviation)} Standard Deviations away from average</h1></div>}
      </div>
    );
  }
}

export default App;
