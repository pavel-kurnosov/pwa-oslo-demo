"use strict";

const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const vision = require("@google-cloud/vision");
const visionClient = new vision.ImageAnnotatorClient();

exports.images = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    visionClient
      .labelDetection(req.rawBody)
      .then(results => {
        const labels = results[0].labelAnnotations.map(obj => obj.description);
        const hotdog = labels.includes("hot dog");

        res.status(200).send({ hotdog, labels });
      })
      .catch(error => {
        console.log(error);
      });
  });
});
