export const natsWrapper = {
  client: {
    publish: async (subject: string, data: string, callback: () => void) =>
      callback(),
  },
};
