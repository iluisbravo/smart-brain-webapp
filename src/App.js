import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import './App.css';

const particlesOptions = {
  particles: {
    number:{
      value: 80,
      density: {
        enable: true,
        value_area:800
      }
    }
  }
};

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '' 
  }
};

class App extends Component {

  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    fetch('https://infinite-depths-21841.herokuapp.com/')
    .then(response => response.json())
    .then(console.log)
    .catch(err => {
      console.log(err);
    });
  }

  loadUser = (user) => {
    this.setState({user: user});
  }

  calculateFaceLocation = (data) => {
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height);

    // console.log('facesRecongitions',data.outputs[0].data.regions);

    const facesRecongitions = data.outputs[0].data.regions;
    const clarifaiFacesBox = facesRecongitions.map(face => {
      const clarifaiFace = face.region_info.bounding_box;
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    });

    // console.log('clarifaiFacesBox',clarifaiFacesBox);

    return clarifaiFacesBox;
  }

  displayFaceBox = (boxes) => {
    console.log(boxes);
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({input : event.target.value });
  }

  onButtonSubmit = () => {
    console.log('click');
    this.setState({imageUrl : this.state.input });
      fetch('https://infinite-depths-21841.herokuapp.com/imageURL', {
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({input: this.state.input})
      })
      .then(response => response.json())
      .then((response) => {
        console.log(response);
        if(!response.hasError){
          this.imageIncrease();
          this.displayFaceBox(this.calculateFaceLocation(response.data));
        }
        else{
          console.log(response);
          alert(`Error: ${response.message}`);
        }

      })
      .catch(err => {
        console.log(err);
        alert(`Error: ${err.message}`);
      });    
  }

  imageIncrease = () => {
    fetch('https://infinite-depths-21841.herokuapp.com/image', {
      method: 'put',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({id: this.state.user.id})
    })
    .then(response => response.json())
    .then(data => {
      if(!data.hasError){
        this.setState(
          Object.assign(this.state.user,{entries: data.entries})
        );
      }
    })
    .catch(err => {
      console.log(err);
      alert(`Error: ${err.message}`);
    });
  }

  onRouteChange = (route) => {

    if(route === "signout" || route === "signin"){
      this.setState(initialState);
    } else if(route === 'home'){
      this.setState({isSignedIn: true});
    }

    this.setState({route: route});
  }

  render(){
    const {imageUrl, route, boxes, isSignedIn} = this.state;
    return (
      <div className="App">

        <Particles className="particles" params={particlesOptions} />
      
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}  />
        {
          route === 'home' 
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition imageUrl = {imageUrl} boxes={boxes}/>
            </div>
          : (
            route === 'signin'
            ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          )
           
        }
        


      </div>
    );
  }

}

export default App;

