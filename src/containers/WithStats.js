import React, { Component } from 'react'
import { getStats } from '../utils/ipfs'

export default function(WrappedComponent) {
    return class extends Component {
        constructor(props) {
            super(props)
            this.state = {
                stats: {
                    id: '?',
                    peers: [],
                    pubKey: '?',
                    dbs: {}
                },
                timeout: null
            }
        }

        async refresh(loop = true) {
            const newStats = await getStats()
            const stats = Object.assign({}, this.state.stats, newStats)
            this.setState({ stats }, loop ? this.refreshDelayed.bind(this) : undefined)
        }

        refreshDelayed() {
            this.timeout = setTimeout(() => {
                this.refresh()
            }, 2000)
        }
        
        componentDidMount() {
            this.refresh()
        }

        componentWillUnmount() {
            if (this.timeout) clearTimeout(this.timeout)
        }

        render() {
            return <WrappedComponent stats={this.state.stats} {...this.props} />
        }
    }
}