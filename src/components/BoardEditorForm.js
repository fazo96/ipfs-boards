import React, { Component } from 'react'
import { Icon, Container, Card, Form, Button } from 'semantic-ui-react'

export default class BoardEditorForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            title: props.title || ''
        }
    }

    render() {
        const { title } = this.state
        const { address, updateBoardMetadata } = this.props
        return <Container>
            <Card fluid centered style={{marginTop:'5em',maxWidth:'40em'}}>
                <Card.Content>
                    <Card.Header>Edit Board</Card.Header>
                    <Card.Meta>
                        Boards is an experimental peer to peer application.<br/>
                        All content you publish will be public and may be lost or
                        changed at any time.<br/>
                        Please do not use this version of Boards
                        for anything other than testing purposes
                    </Card.Meta>
                </Card.Content>
                <Card.Content>
                    <Form>
                        <Form.Field>
                            <label>Title</label>
                            <input
                                value={title}
                                onChange={this.updateTitle.bind(this)}
                            />
                        </Form.Field>
                        <Button fluid onClick={() => updateBoardMetadata(address, this.state)}>
                            <Icon name="save"/> Save
                        </Button>
                    </Form>
                </Card.Content>
            </Card>
        </Container>
    }

    updateTitle(event) {
        const title = event.target.value
        this.setState({ title })
    }
}