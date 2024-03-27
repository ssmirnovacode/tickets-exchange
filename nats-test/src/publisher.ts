import nats from "node-nats-streaming";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

// instead of async/await we have event-based approach here
// we listen to the event 'connect' - when client is successfully connected
stan.on("connect", () => {
  console.log("Publisher connected to NATS");
});
