import React, { Component } from 'react'
import { Form, Button } from 'semantic-ui-react'

export default class BoardForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            address: props.address || ''
        }
    }

    updateAddress(event) {
        const address = event.target.value
        this.setState({ address })
    }

    render() {
        const { address } = this.state
        const { onSave, creating } = this.props
        return <Form>
            <Form.Field>
                <label>Address</label>
                <input
                    placeholder="Paste an existing address or write your new board ID"
                    value={address}
                    onChange={this.updateAddress.bind(this)}
                />
            </Form.Field>
            <Button
                type='submit'
                onClick={() => onSave({ address })}
                disabled={creating}
            >Create</Button>
            {creating ? 'Creating the board...' : ''}
        </Form>
    }
}