import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("listener connected to NATS");

  // gracefully shutting down closed client (e.g., on restart)
  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  const options = stan.subscriptionOptions().setManualAckMode(true); // we use chaining to configure options

  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );
  // subscription is listening to a message event:
  subscription.on("message", (msg: Message) => {
    const data = msg.getData();
    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }
    msg.ack();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
