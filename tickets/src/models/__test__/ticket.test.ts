import { Ticket } from '../ticket';

it('should implement optimistic concurrency control', async () => {
  // create a Ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });
  await ticket.save();

  // fetch the Ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make 2 seperate changes
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save the 1st fetched ticket
  await firstInstance!.save();

  // save the 2nd ticket (outdated) and expect an error
  await expect(secondInstance!.save()).rejects.toThrow();
});

it('should increment the version number on multiple saves', async () => {
  // create a Ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
