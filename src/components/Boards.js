import React from 'react'
import { Button, Card } from 'semantic-ui-react'
import BoardsItem from './BoardsItem'

export default function Boards({ boards, createBoard }) {
    return <div>
        <Card.Group>
            {Object.values(boards).map(board => <BoardsItem key={board.address} {...board} />)}
        </Card.Group>
        <Button onClick={createBoard}>New Board</Button>
    </div>
}