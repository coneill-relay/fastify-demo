import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { connect } from "couchbase";

// using declaration merging, add your plugin props to the appropriate fastify interfaces
declare module "fastify" {
  interface FastifyInstance {
    db: Collection;
  }
}

// define plugin using promises
const myPluginAsync: FastifyPluginAsync = async (fastify, options) => {
  fastify.log.info("Do this once");
  const collection = await connect("couchbase://localhost:8091", {
    username: "admin",
    password: "password",
  }).then((cluster) => cluster.bucket("relay_data").defaultCollection());
  fastify.decorate("db", collection);
};

export default fp(myPluginAsync);
