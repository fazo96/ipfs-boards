import React, { Component } from 'react'
import { Icon, Container, Card, Form, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { shortenAddress } from '../utils/orbitdb';

export default class BoardEditorForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            title: props.title || '',
            website: props.website || '',
            email: props.email || ''
        }
    }

    render() {
        const { title, website, email } = this.state
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
                        <Form.Group widths="equal">
                            <Form.Field>
                                <label>Website</label>
                                <input
                                    value={website}
                                    onChange={this.updateWebsite.bind(this)}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Email</label>
                                <input
                                    value={email}
                                    type="email"
                                    onChange={this.updateEmail.bind(this)}
                                />
                            </Form.Field>
                        </Form.Group>
                        <div className="ui two buttons">
                            <Button as={Link} to={shortenAddress(address)}>
                                <Icon name="arrow left"/> Back
                            </Button>
                            <Button type="submit" onClick={() => updateBoardMetadata(address, this.state)}>
                                <Icon name="save"/> Save
                            </Button>
                        </div>
                    </Form>
                </Card.Content>
            </Card>
        </Container>
    }

    updateTitle(event) {
        const title = event.target.value
        this.setState({ title })
    }

    updateWebsite(event) {
        const website = event.target.value
        this.setState({ website })
    }

    updateEmail(event) {
        const email = event.target.value
        this.setState({ email })
    }
}