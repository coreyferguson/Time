
module.exports = `

  type Query {
    me: User
  }

  type User {
    id: ID!
    timers: [Timer]!
  }

  type Timer {
    id: ID!,
    userId: String!,
    name: String!,
    logs: [TimerLog]!
  }

  type TimerLog {
    time: String!,
    action: String!,
    timer: Timer!
  }

`;
