import nats, { Message } from "node-nats-streaming";

console.clear();
const stan = nats.connect("ticketing", "123", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("listener connected to NATS");

  const subscription = stan.subscribe("ticket:created");
  // subscription is listening to a message event:
  subscription.on("message", (msg: Message) => {
    console.log("ticket:created message received");
  });
});
