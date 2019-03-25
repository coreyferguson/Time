
module.exports = `

  type Query {
    me: User
  }

  type User {
    id: ID!
    timers: [Timer]!
    timer(id: ID!): Timer
  }

  type Timer {
    id: ID!
    userId: String!
    name: String!
    logs(pageSize: Int, cursor: String): TimerLogsConnection!
  }

  type TimerLog {
    time: String!
    action: String!
    timer: Timer!
  }

  """
  Paginated collection of timer logs.
  """
  type TimerLogsConnection {
    after: String
    hasAfter: Boolean!
    data: [TimerLog]!
  }

`;
