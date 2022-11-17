const mongodbStore = require("connect-mongodb-session");

function createSessionStore(session) {
  const MongoDBStore = mongodbStore(session);

  const sessionStore = new MongoDBStore({
    uri: "mongodb+srv://avishka_indula:p7iGGaREtxbhN3t3@cluster0.ibnu8y4.mongodb.net/test",
    databaseName: "auth-blog",
    collection: "sessions",
  });

  return sessionStore;
}

function createSessionConfig(sessionStore) {
  return {
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
    },
  };
}

module.exports = {
  createSessionStore: createSessionStore,
  createSessionConfig: createSessionConfig,
};
