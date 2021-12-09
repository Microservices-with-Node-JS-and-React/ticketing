import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/orders';
import { Ticket } from '../../models/ticket';

it('should set the order as cancelled', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const user = signin();

  // create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // verify the order is cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo('should emit a cancel event');
