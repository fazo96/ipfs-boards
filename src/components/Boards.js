import React from 'react'
import { List } from 'semantic-ui-react'
import BoardsItem from './BoardsItem'
import { Button } from 'semantic-ui-react'

export default function Boards({ boards, createBoard }) {
    return <List divided relaxed>
        {boards.map(board => <BoardsItem {...board} />)}
        <Button onClick={createBoard}>New Board</Button>
    </List>
}