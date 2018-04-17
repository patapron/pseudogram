import React, { Component } from 'react';

class FileUpload extends Component {
  // constructor() {
  //   // siempre inicializar el padre si extiende
  //   super();
  // }

  render() {
    return (
      <div>
        {/* barra de progreso */}
        <progress value={this.props.uploadValue} max="100" />
        <br />
        <input type="file" onChange={this.props.onUpload} />
      </div>
    );
  }
}

export default FileUpload;
