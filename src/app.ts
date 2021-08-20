import * as Fastify from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import couchbase from "./couchbase";

const server = Fastify.fastify({ logger: true });
server.register(couchbase);

// Declare a route
server.get("/", async (request, reply) => {
  const result = await server.db.get("hello");
  reply.send(result);
});

//This allows you type the request object
interface RouteParams extends RouteGenericInterface {
  Params: {
    id: string;
  };
}

server.post<RouteParams>(
  "/:id(^\\d+)",
  {
    schema: {
      params: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
        },
        required: ["id"],
      },
      body: {
        type: "object",
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
        },
        required: ["firstName", "lastName"],
      },
      response: {
        200: {
          type: "object",
          properties: {
            result: { type: "string" },
          },
        },
      },
    },
  },
  async (request, reply) => {
    await server.db.insert(request.params.id, {
      data: request.body,
    });
    reply.send({ result: "OK" });
  }
);

export default server;
