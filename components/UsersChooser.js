import React from 'react'
import userController from "../controllers/users";
import ErrorHandler from "../helpers/ErrorHandler";
import {Autocomplete} from '@material-ui/lab';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import PropTypes from "prop-types";

class UsersChooser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUsers: this.props.preFilledUsers ? this.props.preFilledUsers : [],
            usersSearchResult: []
        }
    }

    onSearchInputChange = (event) => {
        const inputValue = event.target.value
        if (inputValue.length > 3) {
            userController.handleGetUserByEmailOrPhone('email', inputValue).then((response) => {
                this.setState({usersSearchResult: response.data})
            }).catch((error => {
                ErrorHandler.handle(error)
            }))
        }
    }

    handleChange = (event, values) => {
        this.setState({
             selectedUsers : this.props.isEverUsed ? 
                             [...this.props.preFilledUsers, ...values.filter((option) => this.props.preFilledUsers.indexOf(option) === -1 ) ] : 
                             values,
            usersSearchResult: []
        }, () => {
            this.props.onUsersSelected(this.state.selectedUsers)
        })
    }

    render() {
        return (
            <div>
                <Autocomplete
                    style={{width: 800}}
                    multiple
                    autoComplete={true}
                    fullWidth={true}
                    filterSelectedOptions={true}
                    onChange={this.handleChange}
                    getOptionLabel={(option) => option.email}
                    options={this.state.usersSearchResult}
                    value={this.state.selectedUsers}
                    getOptionSelected={(option, value) => {
                        return option.email === value.email
                    }}
                    renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                        <Chip
                            label={option.email}
                            {...getTagProps({ index })}
                            disabled={this.props.isEverUsed ? this.props.preFilledUsers.indexOf(option) !== -1 : ''}
                        />
                        ))
                    }

                    renderInput={(params) => (
                        <TextField
                            {...params}
                            onChange={this.onSearchInputChange}
                            variant="outlined"
                            label="User Email"
                            placeholder="Enter user..."
                        />
                    )}
                />
            </div>
        )
    }
}

export default UsersChooser

UsersChooser.propTypes = {
    preFilledUsers: PropTypes.any,
    onUsersSelected: PropTypes.func.isRequired
}
