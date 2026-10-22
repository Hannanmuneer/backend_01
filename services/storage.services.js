require('dotenv').config();

const ImageKit = require('@imagekit/nodejs');

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_URI
});

async function uploadImage(buffer, filename) {
  try {
    const response = await imagekit.files.upload({
        file: buffer.toString("base64"), 
        fileName: filename,
    });
    return response;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

module.exports =  uploadImage ;