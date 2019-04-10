import React, { Component } from 'react';
import {FaFileArchive} from 'react-icons/fa';

import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Dropzone from 'react-dropzone';

import socket from 'socket.io-client';

import './styles.css';
import logo from '../../assets/logo.svg';

import api from '../../services/api';

export default class Box extends Component {

    state = {
        box: {},
    };

    async componentDidMount() {
        this.subscribeToNewFiles();
        const id = this.props.match.params.id;
        const response = await api.get(`boxes/${id}`)
        this.setState({box: response.data});
    }

    subscribeToNewFiles = () => {
        const id = this.props.match.params.id;
        const io = socket('https://omnigobb.herokuapp.com')
        io.emit('connectRoom', id);
        io.on('file', data => {
            const box = this.state.box;
            box.files.push(data);
            this.setState({box: box});
        });
    }


    handleUpload = (files) => {
        files.forEach(file => {
            const data = new FormData();
            const id = this.props.match.params.id;
            data.append('file', file);
            api.post(`boxes/${id}/files`, data);
        });
    }

    render() {
        return (

            <div id="box-container">
                <header>
                    <img src={logo} alt="Rocketbox"/>
                    <h1>{this.state.box.title}</h1>
                </header>

                <Dropzone onDropAccepted={this.handleUpload}>
                    {({getRootProps, getInputProps}) => (
                        <div className="upload" {...getRootProps()}>
                            <input {... getInputProps()}/>
                            <p>Arraste arquivos ou clique aqui...</p>
                        </div>
                    )}
                </Dropzone>

                <ul>
                {this.state.box.files && this.state.box.files.map( file => (
                    <li key={file._id}>
                        <a className='fileInfo' href={file.url} target="_blank" rel="noopener noreferrer">
                            <FaFileArchive size={24} color="#A5CF66"/>
                            <strong>{file.title}</strong>
                        </a>
                        <span>há {distanceInWords(file.createdAt, new Date(), {locale: pt})}</span>
                    </li>
                ))}
                </ul>
            </div>
        );
    }
}
