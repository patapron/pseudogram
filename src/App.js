import React, { Component } from 'react';
import firebase from 'firebase';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  // función de ciclo de vida de react, se carga despues del render
  componentWillMount() {
    // Listener que nos devuelve los cambios en la información del usuario, login, exit, etc
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      // Modifica el estado
      this.setState({
        // si la clabe y el valor son iguales, nos ahorramos poner user: user
        user
      });
    })
  }

  handleAuth() {
    // Método de autentificación de firebase
    const provider = new firebase.auth.GoogleAuthProvider();

    // Función auth de la API de firebase, le pasamos el proveedor Google.
    // devuelve promesa, es neceario capturar con un then. `template string`
    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesión`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogOut() {
    // Método para hace3r logout
    firebase.auth().signOut()
      .then(result => console.log(`Ha salido`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  renderLoginButton() {
    // Si el usuario está logeado
    if (this.state.user) {
      return (
        <div>
          <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName} />
          <p>Hola {this.state.user.displayName}!</p>
          <button onClick={this.handleLogOut}>Salir</button>
        </div>
      );
    } else {
      // Si no lo está
      return (
        <button onClick={this.handleAuth}>Login con Google</button>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2 className="App-title">Pseudogram</h2>
        </header>
        <div className="App-intro">
          {this.renderLoginButton()}
        </div>
      </div>
    );
  }
}

export default App;
