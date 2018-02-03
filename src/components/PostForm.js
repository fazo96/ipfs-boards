import React, { Component } from 'react'
import { Form, Button } from 'semantic-ui-react'

export default class PostEditor extends Component {
    constructor(props){
        super(props)
        this.state = {
            title: props.title || '',
            content: props.content || ''
        }
    }

    updateTitle(event) {
        this.setState({ title: event.target.value })
    }

    updateContent(event) {
        this.setState({ content: event.target.value })
    }

    render() {
        const { title, content } = this.state
        const { onSave } = this.props
        return <Form>
            <Form.Field>
                <label>Title</label>
                <input
                    placeholder="What's this about?"
                    value={title}
                    onChange={this.updateTitle.bind(this)}
                />
            </Form.Field>
            <Form.Field>
                <label>Content</label>
                <input
                    placeholder='Write your thoughts'
                    value={content}
                    onChange={this.updateContent.bind(this)}
                />
            </Form.Field>
            <Button
                type='submit'
                onClick={() => onSave({ title, content })}
            >Submit</Button>
        </Form>
    }
}