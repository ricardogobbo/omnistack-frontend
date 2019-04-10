import React, { Component } from 'react';

import './styles.css';
import logo from '../../assets/logo.svg';

import api from '../../services/api';

export default class Main extends Component {

    state = {
        newBox: '',
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        const res = await api.post('boxes', {title: this.state.newBox});
        
        this.props.history.push(`/box/${res.data._id}`)

    };

    handleInputChange = (e) => {
        this.setState({newBox: e.target.value})
    };

    render() {
        return (
            <div id="main-container">
                <form onSubmit={this.handleSubmit}>
                    <img src={logo} alt="Rocketbox"/>
                    <input type="text" placeholder="Criar um box" 
                            value={this.state.newBox}
                            onChange={this.handleInputChange}
                    />
                    <button>Criar {this.state.newBox.toString().substr(0,20)}</button>
                </form>
            </div>
        );
    }
}
