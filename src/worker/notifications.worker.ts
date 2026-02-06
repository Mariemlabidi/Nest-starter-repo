import { Worker } from 'bullmq';

const worker = new Worker(
  'notifications',
  async job => {
    console.log(' Notification en cours...');
    console.log('Message :', job.data);

    // Simuler un échec
    if (Math.random() < 0.3) {
      throw new Error('Random failure');
    }

    console.log(' Notification envoyée');
  },
  {
    connection: {
      host: 'localhost',
      port: 6379,
    },
  },
);

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} échoué`, err.message);
});
