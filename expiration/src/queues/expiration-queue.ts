import Queue from "bull";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST, // redis host specify en expiration-depl.yaml
  },
});

expirationQueue.process(async (job) => {
  console.log(
    `Here we will publish the expiration:complete event with orderId: ${job.data.orderId}`
  );
});

export { expirationQueue };
