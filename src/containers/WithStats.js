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
                interval: null
            }
        }

        async refresh(loop = true) {
            const newStats = await getStats()
            const stats = Object.assign({}, this.state.stats, newStats)
            this.setState({ stats }, loop ? this.refreshDelayed.bind(this) : undefined)
        }

        refreshDelayed() {
            const timeout = setTimeout(() => {
                this.refresh()
            }, 2000)
            this.setState({ timeout })
        }
        
        componentDidMount() {
            this.refresh()
        }

        componentWillUnmount() {
            if (this.state.interval) clearInterval(this.state.interval)
        }

        render() {
            return <WrappedComponent stats={this.state.stats} {...this.props} />
        }
    }
}