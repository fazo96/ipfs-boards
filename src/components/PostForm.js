import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, Container, Form, Icon, Button } from 'semantic-ui-react'
import { shortenAddress } from '../utils/orbitdb';

export default class PostForm extends Component {
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
        const { onSave, board } = this.props
        const { address } = board
        return <Container>
            <Card fluid centered style={{marginTop:'5em',maxWidth:'40em'}}>
                <Card.Content>
                    <Card.Header>New Post</Card.Header>
                    <Card.Meta>
                        Boards is an experimental peer to peer application.<br/>
                        All content you publish will be public and may be lost or
                        changed at any time.<br/>
                        Please do not use this version of Boards
                        for anything other than testing purposes
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    <Icon name="chain"/> {address}
                </Card.Content>
                <Card.Content>
                    <Form>
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
                        <Button as={Link} to={shortenAddress(address)}>
                            <Icon name="chevron left"/> Board
                        </Button>
                        <Button type='submit' onClick={() => onSave({ title, text: content })}>
                            <Icon name="save"/> Submit
                        </Button>
                    </Form>
                </Card.Content>
            </Card>
        </Container>
    }
}