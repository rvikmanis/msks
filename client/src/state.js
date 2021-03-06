import history from './history'

const initialState = {
  isBroken: false,

  isVisible: true,

  isSocketConnected: false,
  isSocketReconnected: false,

  route: {
    location: history.location,
    action: 'PUSH',
    path: '',
    params: {},
    meta: {},
    pathname: '',
    query: {},
  },

  scrollPositions: {
    // 'messages.#developerslv': 123,
    // 'search.#developerslv': 234,
  },

  channels: {
    // '##javascript': {
    //   'name': '##javascript',
    //   'topic': 'Can't talk? Get registered on freenode (HOWTO: https://gist.github.com/brigand/f271177642368307f051 ). | JavaScript is *not* Java. | Just ask your question. | Say \'!mdn abc\' for docs on \'abc\'. | Don't paste code in the channel.',
    // },
    // '#developerslv': {
    //   'name': '#developerslv',
    //   'topic': 'About software and hacking in Latvian. | Can't talk? Get registered on Freenode.',
    // },
  },
  resetChannels: false,

  users: {
    // '#developerslv': {
    //   'msks': {
    //     'id': ['#developerslv', 'msks'],
    //     'channel': '#developerslv',
    //     'nick': 'msks',
    //     'isVoiced': true,
    //   },
    //   'daGrevis': {
    //     'id': ['#developerslv', 'daGrevis'],
    //     'channel': '#developerslv',
    //     'nick': 'daGrevis',
    //     'isOp': true,
    //   },
    // },
  },
  resetUsers: {
    // '#developerslv': true,
  },

  messages: {
    // '##javascript': [
    //   {
    //     'id': '7eec370e-36e4-496a-9dcf-390cbfa1fbe0',
    //     'from': 'Sorella',
    //     'to': '##javascript',
    //     'text': 'Chrome only allows up to 1GB heaps',
    //     'kind': 'message',
    //     'timestamp': '2016-11-21T21:13:44.338Z',
    //   },
    //   {
    //     'id': 'd3348233-440e-4962-b60a-9fb174f75331',
    //     'from': 'reisio',
    //     'to': '##javascript',
    //     'text': 'shrugs',
    //     'kind': 'action',
    //     'timestamp': '2016-11-21T21:13:41.985Z',
    //   },
    // ],
  },

  search: {
    channelName: null,
    query: {
      // text: 'bar',
    },
    hasReachedBeginning: false,
    messages: [
      // {
      //   'id': '7eec370e-36e4-496a-9dcf-390cbfa1fbe0',
      //   'from': 'Sorella',
      //   'to': '##javascript',
      //   'text': 'Chrome only allows up to 1GB heaps',
      //   'kind': 'message',
      //   'timestamp': '2016-11-21T21:13:44.338Z',
      // },
    ],
  },

  isSubscribedToUsers: {
    // '#developerslv': true,
  },
  isSubscribedToMessages: {
    // '#developerslv': true,
  },

  isViewingArchive: {
    // '#developerslv': false,
  },

  hasReachedBeginning: {
    // '#developerslv': true,
  },

  unread: 0,
}

export {
  initialState,
}
