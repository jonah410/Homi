const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const { Storage } = require('@google-cloud/storage');

admin.initializeApp();
const storage = new Storage();

exports.uploadProfilePicture = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
      }

      const { file, userId } = req.body;
      if (!file || !userId) {
        return res.status(400).send('Missing file or userId');
      }

      const bucket = storage.bucket('YOUR_BUCKET_NAME');
      const fileName = `profile_pictures/${userId}`;
      const fileBuffer = Buffer.from(file, 'base64');

      await bucket.file(fileName).save(fileBuffer, {
        metadata: { contentType: 'image/jpeg' },
        resumable: false
      });

      const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;

      return res.status(200).json({ url: fileUrl });
    } catch (error) {
      console.error('Error uploading file:', error);
      return res.status(500).send('Internal Server Error');
    }
  });
});

