import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './FileUpload';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      pictures: [],
      uploadValue: 0,
      showBubble: false
    };

    this.showBubbleAction = this.showBubbleAction.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    // función que manejará el evento de upload
    this.handleUpload = this.handleUpload.bind(this);
  }

  // función de ciclo de vida de react, se carga despues del render
  componentWillMount() {
    // Cada vez que el método 'onAuthStateChanged' se dispara, recibe un objeto (user)
    // Lo que hacemos es actualizar el estado con el contenido de ese objeto.
    // Si el usuario se ha autenticado, el objeto tiene información.
    // Si no, el usuario es 'null'
    // Listener que nos devuelve los cambios en la información del usuario, login, exit, etc
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      // Modifica el estado
      this.setState({
        // si la clabe y el valor son iguales, nos ahorramos poner user: user
        user
      });
    });

    firebase
      .database()
      .ref('pictures')
      .on('child_added', snapshot => {
        this.setState({
          pictures: this.state.pictures.concat(snapshot.val())
        });
      });
  }

  handleAuth() {
    // Método de autentificación de firebase
    const provider = new firebase.auth.GoogleAuthProvider();

    // Función auth de la API de firebase, le pasamos el proveedor Google.
    // devuelve promesa, es neceario capturar con un then. `template string`
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesión`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogOut() {
    // Método para hace3r logout
    firebase
      .auth()
      .signOut()
      .then(result => console.log(`Ha salido`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  renderLoginButton() {
    // Si el usuario está logeado
    if (this.state.user) {
      return (
        <div>
          {/* cargamos el gestor de archivos */}
          <FileUpload
            onUpload={this.handleUpload}
            uploadValue={this.state.uploadValue}
          />
          {this.state.pictures
            .map((picture, i) => (
              <div className="App-card" key={i}>
                <figure className="App-card-image">
                  <figcaption className="App-card-footer">
                    <img
                      className="App-card-avatar"
                      src={picture.photoURL}
                      alt={picture.displayName}
                    />
                    <span className="App-card-name">{picture.displayName}</span>
                  </figcaption>
                  <img src={picture.image} alt={picture.displayName} />
                </figure>
              </div>
            ))
            .reverse()}
        </div>
      );
    } else {
      // Si no lo está
      return <button onClick={this.handleAuth}>Login con Google</button>;
    }
  }

  handleUpload(event) {
    // el evento de subida trae un array de archivos
    const file = event.target.files[0];

    // configuramos el lugar donde queremos que se almacene el archivo
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`);

    // sube el fichero al almacenamiento
    const task = storageRef.put(file);

    // evento state de firebase cuando se sube un fichero
    task.on(
      'state_changed',
      snapshot => {
        // nos devuelve el porcentaje de fichero que se ha subido
        let percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        // lo asignamos al valor de la barra
        this.setState({
          uploadValue: percentage
        });
      },
      error => {
        console.log(error.message);
      },
      () => {
        const record = {
          photoURL: this.state.user.photoURL,
          displayName: this.state.user.displayName,
          image: task.snapshot.downloadURL,
          date: Date(),
          karma: 0
        };

        const dbRef = firebase.database().ref('pictures');
        const newPicture = dbRef.push();
        newPicture.set(record);

        // // cuando ya se ha subido la imagen
        // this.setState({
        //   // barra al 100%
        //   uploadValue: 100,
        //   // la imagen será la url de subida
        //   picture: task.snapshot.downloadURL
        // });
      }
    );
  }

  showBubbleAction(event) {
    this.setState({ showBubble: !this.state.showBubble });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-banner">
            <div className="App-title">
              <h2>White & Green</h2>
            </div>
            {this.state.user && (
              <div className="float-user">
                <img
                  src={this.state.user.photoURL}
                  alt={this.state.user.displayName}
                  onClick={this.showBubbleAction}
                  className="float-img"
                />
                <div
                  className={
                    'float-bubble ' +
                    (this.state.showBubble ? 'show' : 'hidden')
                  }
                >
                  <button onClick={this.handleLogOut}>Salir</button>
                </div>
              </div>
            )}
          </div>
        </header>
        <div className="App-intro">{this.renderLoginButton()}</div>
      </div>
    );
  }
}

export default App;
