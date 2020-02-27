// eslint-disable-next-line import/extensions
import Album from './models/album';

async function run() {
  const albums = await Album.findById(2500, { includes: ['user', 'photos', 'test'] });
  console.log(albums);
}

run().catch((err) => {
  console.error(err);
});
