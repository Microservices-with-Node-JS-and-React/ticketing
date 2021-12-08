import nats from 'node-nats-streaming';

/*
    directly connect to the NATS Pod:
    kubectl port-forward {NATS Pod id} {from port on local machine}:{to port inside the POD}
*/

console.clear();

const stan = nats.connect('ticketing', 'abv', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });
});
