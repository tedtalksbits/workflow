export const config = {
  db: {
    // MongoDB connection URI.
    // See 👉 https://mongoosejs.com/docs/connections.html#connection-uris
    uri: 'mongodb://127.0.0.1:27017/workflow',
    // MongoDB connection options.
    // See 👉 https://mongoosejs.com/docs/connections.html#options
  },
  app: {
    secret: 'workflow',
  },
};
