require("dotenv").config();
const fs = require("fs");
const path = require("path");
const https = require("https");

const IMAGE_DIR =
  process.env.NODE_ENV === "DEV"
    ? path.join(__dirname, "../files")
    : "/usr/src/app/files";
const CACHE_DURATION = 10 * 60 * 1000; // 10 menit dalam milliseconds

// Variable untuk melacak request setelah cache expired
let firstRequestAfterExpiry = false;
let lastCacheExpiredTime = null;

if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https
      .get(url, (response) => {
        // Handle redirect
        if (response.statusCode === 302 || response.statusCode === 301) {
          file.close();
          fs.unlinkSync(filepath); // Hapus file kosong

          // Follow redirect
          https
            .get(response.headers.location, (redirectResponse) => {
              const newFile = fs.createWriteStream(filepath);
              redirectResponse.pipe(newFile);

              newFile.on("finish", () => {
                newFile.close();
                resolve(filepath);
              });

              newFile.on("error", (err) => {
                fs.unlink(filepath, () => {});
                reject(err);
              });
            })
            .on("error", (err) => {
              fs.unlink(filepath, () => {});
              reject(err);
            });
        } else {
          response.pipe(file);

          file.on("finish", () => {
            file.close();
            resolve(filepath);
          });

          file.on("error", (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
          });
        }
      })
      .on("error", (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
  });
};

const getImage = async () => {
  try {
    const files = fs
      .readdirSync(IMAGE_DIR)
      .filter((file) => file.startsWith("image_") && file.endsWith(".jpg"))
      .map((file) => {
        const filepath = path.join(IMAGE_DIR, file);
        const stats = fs.statSync(filepath);
        return {
          filename: file,
          filepath: filepath,
          mtime: stats.mtime,
        };
      })
      .sort((a, b) => b.mtime - a.mtime);

    const now = new Date();

    if (files.length > 0) {
      const latestFile = files[0];
      const timeDiff = now - latestFile.mtime;

      // Jika masih dalam cache duration, gunakan cached image
      if (timeDiff < CACHE_DURATION) {
        console.log(`Using cached image: ${latestFile.filename}`);
        return `/images/${latestFile.filename}`;
      }

      // Cache sudah expired
      const currentExpiredTime = Math.floor(
        latestFile.mtime.getTime() / CACHE_DURATION
      );

      // Reset flag jika ini periode expired yang baru
      if (lastCacheExpiredTime !== currentExpiredTime) {
        firstRequestAfterExpiry = false;
        lastCacheExpiredTime = currentExpiredTime;
      }

      // Jika ini request pertama setelah cache expired, gunakan gambar lama
      if (!firstRequestAfterExpiry) {
        firstRequestAfterExpiry = true;
        console.log(
          `First request after cache expired, using cached image: ${latestFile.filename}`
        );
        return `/images/${latestFile.filename}`;
      }

      // Jika ini request kedua atau lebih setelah cache expired, download gambar baru
      console.log(`Second request after cache expired, downloading new image`);
    }

    const timestamp = now.getTime();
    const filename = `image_${timestamp}.jpg`;
    const filepath = path.join(IMAGE_DIR, filename);

    console.log(`Downloading new image: ${filename}`);
    await downloadImage("https://picsum.photos/1200", filepath);

    // Reset flag setelah download gambar baru
    firstRequestAfterExpiry = false;
    lastCacheExpiredTime = null;

    // Verifikasi ukuran file
    const stats = fs.statSync(filepath);
    console.log(`Downloaded file size: ${stats.size} bytes`);

    // Hapus file lama
    files.forEach((file) => {
      try {
        fs.unlinkSync(file.filepath);
        console.log(`Deleted old image: ${file.filename}`);
      } catch (err) {
        console.log("Error deleting old file:", err.message);
      }
    });

    return `/images/${filename}`;
  } catch (error) {
    console.error("Error managing image:", error);
    return "https://via.placeholder.com/1200x600/cccccc/666666?text=Image+Not+Available";
  }
};

module.exports = {
  getImage,
};
