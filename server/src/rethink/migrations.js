const r = require('./index')

const migrations = [
  r.tableCreate('channels', { primaryKey: 'name' }),
  r.table('channels').indexWait(),

  r.tableCreate('users', { durability: 'soft' }),
  r.table('users').indexCreate('channel'),
  r.table('users').indexCreate('nick'),
  r.table('users').indexWait(),

  r.tableCreate('messages'),
  r.table('messages').indexCreate('to'),
  r.table('messages').indexCreate('timestamp'),
  r.table('messages').indexCreate('toAndTimestamp', [r.row('to'), r.row('timestamp')]),
  r.table('messages').indexWait(),
]

module.exports = migrations
