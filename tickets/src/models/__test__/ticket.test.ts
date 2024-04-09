import { Ticket } from "../ticket";

describe("Ticket model", () => {
  it("implements optimistic concurrency control", async () => {
    const ticket = Ticket.build({
      title: "concert",
      price: 25,
      userId: "123",
    });

    await ticket.save();

    //fetch that ticket from DB twice:
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    //make 2 separate changes to the fetched tickets
    firstInstance!.set("price", 10);
    secondInstance!.set("price", 15);

    // save the first fetched ticket
    await firstInstance!.save();

    // save the second fetched ticket and expect an error
    try {
      await secondInstance!.save();
    } catch (err) {
      return;
    }

    throw new Error("Code should not reach this line");
  });

  it("increments the version number on multiple saves", async () => {
    const ticket = Ticket.build({
      title: "concert",
      price: 25,
      userId: "123",
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
  });
});
