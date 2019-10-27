import React from 'react'
import { Button } from '@material-ui/core'
import { refreshInfo, getInfo } from './system'
import SSRIcon from '@material-ui/icons/SignalCellularNull'
import ConnectedIcon from '@material-ui/icons/SignalCellular1Bar'

class Status extends React.PureComponent {
  state = { info: getInfo() || {} }

  componentDidMount() {
    this.refresh()
  }
  
  componentWillUnmount() {
    clearTimeout(this.state.timeout)
  }

  async refresh() {
    const info = await refreshInfo()
    this.setState({
      info, timeout: setTimeout(this.refresh.bind(this), 3000)
    })
  }

  render() {
    const { info } = this.state
    let Icon = SSRIcon
    let statusText = 'Pre-Rendered'
    if (!info.isServer) {
      statusText = 'Offline'
      if (info.ipfsReady) {
        statusText = 'Starting DB'
        Icon = ConnectedIcon
      }
      if (info.orbitDbReady) statusText = `${info.ipfsPeers.length} Peers`
    }

    return <Button color="inherit">
      {statusText} <Icon /> 
    </Button>
  }
}

export default Status