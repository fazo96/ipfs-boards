import React, { Component } from 'react'
import { Form, Button } from 'semantic-ui-react'

export default class BoardForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            title: props.title || ''
        }
    }

    updateTitle(event) {
        this.setState({ title: event.target.value })
    }

    render() {
        const { title, content } = this.state
        const { onSave } = this.props
        return <Form>
            <Form.Field>
                <label>Title</label>
                <input
                    placeholder="What's this board about?"
                    value={title}
                    onChange={this.updateTitle.bind(this)}
                />
            </Form.Field>
            <Button
                type='submit'
                onClick={() => onSave({ title, content })}
            >Create</Button>
        </Form>
    }
}