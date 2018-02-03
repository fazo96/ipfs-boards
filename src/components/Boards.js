import React from 'react'
import { List } from 'semantic-ui-react'
import BoardsItem from './BoardsItem'

export default function Boards({ boards }) {
    return <List divided relaxed>
        {boards.map(board => <BoardsItem {...board} />)}
    </List>
}