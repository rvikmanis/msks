import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'

import config from '../config'
import { push, subscribeToUsers, toggleSearch, inputSearch } from '../actions'
import {
  routeSelector, channelSelector, userCountSelector, groupedUsersSelector,
  isSearchOpenSelector, searchQuerySelector, activeMessageSelector,
} from '../selectors'
import Text from '../components/Text'
import Link from '../components/Link'
import Messages from '../components/Messages'
import SearchMessages from '../components/SearchMessages'
import SearchInput from './SearchInput'
import Users from './Users'

import '../styles/Channel.css'
import searchSvg from '../vectors/search.svg'

class Channel extends React.Component {
  state = {
    isTopicClipped: true,
    isSidebarOpen: false,
  }

  componentDidMount() {
    this.props.subscribeToUsers(this.props.channel.name)
  }

  onNameClick = () => {
    const { channel, activeMessage, isSearchOpen, push } = this.props

    if (config.embedChannel) {
      push('/')
    } else {
      if (activeMessage || isSearchOpen) {
        push(`/${channel.name}`)
      } else {
        push('/')
      }
    }
  }

  onSearchIconClick = () => {
    this.props.toggleSearch()
  }

  onHamburgerIconClick = () => {
    this.setState(prevState => ({
      isSidebarOpen: !prevState.isSidebarOpen,
    }))
  }

  onTopicClick = () => {
    this.setState(prevState => ({
      ...prevState,
      isTopicClipped: !prevState.isTopicClipped,
    }))
  }

  onSidebarClick = () => {
    this.setState({ isSidebarOpen: false })
  }

  render() {
    const channelClasses = classNames({
      'is-sidebar-open': this.state.isSidebarOpen,
      'is-sidebar-closed': !this.state.isSidebarOpen,
    })
    const hamburgerClasses = classNames('hamburger-icon hamburger hamburger--squeeze', {
      'is-active': this.state.isSidebarOpen,
    })
    const nameClasses = classNames('name strong', {
      'is-embed': config.embedChannel,
    })
    const topicClasses = classNames('topic', {
      'is-topic-clipped': this.state.isTopicClipped,
    })

    return (
      <div id='channel' className={channelClasses}>
        <div className='content'>
          <div className='header'>
            <div className={hamburgerClasses} onClick={this.onHamburgerIconClick}>
              <div className='hamburger-box'>
                <div className='hamburger-inner'></div>
              </div>
            </div>
            <Link className='search-icon' onClick={this.onSearchIconClick}>
              <img src={searchSvg} alt='' />
            </Link>

            <h2 className={nameClasses} onClick={this.onNameClick}>
              {this.props.channel.name}
            </h2>
            <span className='user-count'>[ {this.props.userCount || '—'} ]</span>

            {!this.props.channel.topic ? null : (
              <div className={topicClasses} onClick={this.onTopicClick}>
                <div>
                  <Text>{this.props.channel.topic}</Text>
                </div>
              </div>
            )}
          </div>

          {this.props.isSearchOpen
            ? <SearchMessages />
            : <Messages />}

          {this.props.isSearchOpen
            ? <SearchInput query={this.props.searchQuery} inputSearch={this.props.inputSearch} />
            : null}
        </div>

        <div className='sidebar' onClick={this.onSidebarClick}>
          <Users
            groupedUsers={this.props.groupedUsers}
            channel={this.props.channel}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    channel: channelSelector(state),
    route: routeSelector(state),
    groupedUsers: groupedUsersSelector(state),
    userCount: userCountSelector(state),
    isSearchOpen: isSearchOpenSelector(state),
    searchQuery: searchQuerySelector(state),
    activeMessage: activeMessageSelector(state),
  }
}

const mapDispatchToProps = {
  push,
  subscribeToUsers,
  toggleSearch,
  inputSearch,
}

export default connect(mapStateToProps, mapDispatchToProps)(Channel)
