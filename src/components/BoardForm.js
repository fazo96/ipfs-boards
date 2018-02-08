import React, { Component } from 'react'
import { Container, Card, Form, Button } from 'semantic-ui-react'

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
        const { openBoard, opening } = this.props
        return <Container>
            <Card fluid centered style={{marginTop:'5em',maxWidth:'40em'}}>
                <Card.Content>
                    <Card.Header>Open a Board</Card.Header>
                    <Card.Meta>
                        Boards is an experimental peer to peer application.<br/>
                        All content you publish will be public and may be lost or
                        changed at any time.<br/>
                        Please do not use this version of Boards
                        for anything other than testing purposes
                    </Card.Meta>
                </Card.Content>
                <Card.Content>
                    <Form loading={opening}>
                        <Form.Field>
                            <input
                                placeholder="Paste an existing address or write your new board ID"
                                value={address}
                                onChange={this.updateAddress.bind(this)}
                            />
                        </Form.Field>
                        <Button fluid onClick={() => openBoard({ address })}>Open</Button>
                    </Form>
                </Card.Content>
            </Card>
        </Container>
    }
}