import React, { Component } from 'react';


class FileUpload extends Component {
    constructor() {
        // siempre inicializar el padre si extiende
        super();
        // declaramos el objeto de estado de react
        this.state = {
            uploadValue: 0
        };
    }


    render() {
        return (
            <div>
                {/* barra de progreso */}
                <progress value={this.state.uploadValue} max='100'></progress>
                <br />
                <input type="file" onChange={this.props.onUpload} />
            </div>
        );
    }
}

export default FileUpload;