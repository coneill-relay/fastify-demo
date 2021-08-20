import server from "./app";

// Run the server!
server.listen(3000, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
const event = "unhandledRejection";

process.on(event, function (err) {
  server.log.error(err);
  process.abort();
});
