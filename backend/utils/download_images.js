const fs = require('fs');
const path = require('path');
const http = require('https');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Ensure directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const images = [
  {
    name: 'classic_cheeseburger.jpg',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'bbq_bacon_burger.jpg',
    url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'truffle_fries.jpg',
    url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop'
  },
  {
    name: 'vanilla_milkshake.jpg',
    url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    http.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  console.log('Downloading sample images to uploads directory...');
  for (const img of images) {
    const destPath = path.join(UPLOADS_DIR, img.name);
    console.log(`Downloading ${img.name}...`);
    try {
      await download(img.url, destPath);
      console.log(`Saved ${img.name}`);
    } catch (err) {
      console.error(`Failed to download ${img.name}:`, err.message);
    }
  }
  console.log('All image downloads complete!');
}

run();
