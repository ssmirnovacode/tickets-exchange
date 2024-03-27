import nats from "node-nats-streaming";

console.clear();
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

// instead of async/await we have event-based approach here
// we listen to the event 'connect' - when client is successfully connected
stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  // only raw data can be passed, no objects
  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: 20,
  });

  stan.publish("ticket:created", data, () => {
    console.log("ticket:created event published");
  });
});
