const Promise = require('bluebird')
const _ = require('lodash')
const fp = require('lodash/fp')

const r = require('./rethink')
const { validate } = require('./schemas')
const schemas = require('./schemas')
const retry = require('./retry')

const createChannel = async function(channel) {
  await validate(channel, schemas.Channel)
  // Creates the channel or silently fails when it exists already.
  await r.table('channels').insert(channel).run().catch(_.noop)
}

const joinChannel = async function(user) {
  await validate(user, schemas.User)
  await r.table('users').insert(user, { conflict: 'replace' }).run()
}

const leaveChannel = async function(channel, nick) {
  await r.table('users').get([channel, nick]).delete().run()
}

const leaveNetwork = async function(nick) {
  const { changes } = await r.table('users').getAll(nick, { index: 'nick' })
    .delete({ returnChanges: true }).run()

  return _.map(changes, 'old_val.channel')
}

const updateNick = async function(nick, newNick) {
  const { changes } = await r.table('users').getAll(nick, { index: 'nick' })
    .delete({ returnChanges: true }).run()

  const newUsers = _.map(changes, ({ old_val }) => ({
    id: [old_val.channel, newNick],
    channel: old_val.channel,
    nick: newNick,
  }))
  await Promise.all(_.map(newUsers, user => validate(user, schemas.User)))

  await r.table('users').insert(newUsers, { conflict: 'replace' }).run()

  return newUsers
}

const updateUsers = async function(channel, users) {
  await Promise.all(_.map(users, user => validate(user, schemas.User)))

  await r.table('users').getAll(channel, { index: 'channel' }).delete().run()
  await r.table('users').insert(users, { conflict: 'replace' }).run()
}

const updateUser = async function(user) {
  await validate(user, schemas.User)
  await r.table('users').get(user.id).update(user).run()
}

const updateTopic = async function(channel, topic) {
  await r.table('channels').get(channel).update({ topic }).run()
}

const saveMessage = async function(message) {
  await validate(message, schemas.Message)
  await r.table('messages').insert(message).run()
}

const getInitialChannels = () => (
  r.table('channels')
)

const getInitialUsers = channelName => (
  r.table('users')
  .getAll(channelName, { index: 'channel' })
)

const getInitialMessages = async (channelName) => {
  const messages = await r.table('messages')
    .between([channelName, r.minval], [channelName, r.maxval], { index: 'toAndTimestamp' })
    .orderBy({ index: r.desc('toAndTimestamp') })
    .limit(75)

  return fp.reverse(messages)
}

const getMessagesBefore = async (channelName, timestamp, messageId) => {
  return await (
    r.table('messages')
    .between(
      [channelName, r.minval],
      [channelName, timestamp],
      { index: 'toAndTimestamp' }
    )
    .orderBy({ index: r.desc('toAndTimestamp') })
    .filter(r.row('id').ne(messageId))
    .limit(75)
    .orderBy(r.asc('timestamp'))
  )
}

const getMessagesAfter = async (channelName, timestamp, messageId) => {
  return await (
    r.table('messages')
    .between(
      [channelName, timestamp],
      [channelName, r.maxval],
      { index: 'toAndTimestamp' }
    )
    .orderBy({ index: 'toAndTimestamp' })
    .filter(r.row('id').ne(messageId))
    .limit(75)
  )
}

const getMessagesAround = async (channelName, messageId) => {
  const message = await r.table('messages').get(messageId)

  if (!message) {
    return []
  }

  if (message.to !== channelName) {
    return []
  }

  const messagesBefore = await getMessagesBefore(channelName, message.timestamp, message.id)
  const messagesAfter = await getMessagesAfter(channelName, message.timestamp, message.id)

  return fp.reduce(fp.concat, [], [messagesBefore, [message], messagesAfter])
}

const queries = fp.mapValues(retry, {
  createChannel,
  joinChannel,
  leaveChannel,
  leaveNetwork,
  updateNick,
  updateUsers,
  updateUser,
  updateTopic,
  saveMessage,
  getInitialChannels,
  getInitialUsers,
  getInitialMessages,
  getMessagesBefore,
  getMessagesAfter,
  getMessagesAround,
})

module.exports = queries