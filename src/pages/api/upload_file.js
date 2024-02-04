const ImageKit = require('imagekit');
import { getServerSession } from "next-auth/next"
import authOptions from "./auth/[...nextauth]"

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

export const config = {
  api: {
      bodyParser: {
          sizeLimit: '10mb' // Set desired value here
      }
  }
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401);
  }

  const data = JSON.parse(req.body);

  imagekit.upload({
    file: data.image,
    fileName: `${data.challenge}-${session.user.email.replace("@stuy.edu", "")}`,
    useUniqueFileName: false
  }, function(error, result) {
    if (error) {
      console.error(error);
      res.status(500);
    } else {
      res.status(200);
    }
  });
}