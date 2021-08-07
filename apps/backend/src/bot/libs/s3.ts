import { botLogger } from "../helpers/logger";

import AWS from "aws-sdk";

const S3Client = new AWS.S3({
  accessKeyId: process.env.S3_ACCESSKEY,
  secretAccessKey: process.env.S3_SECRETKEY,
  endpoint: process.env.S3_ENDPOINT,
  signatureVersion: "v4",
});

const bucketName = process.env.S3_BUCKET;

export async function setupS3() {
  try {
    await S3Client.putBucketPolicy({
      Bucket: bucketName,
      Policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: [`${bucketName}/uploads/*`],
          },
        ],
      }),
    }).promise();

    await S3Client.getBucketPolicy({ Bucket: bucketName }).promise().then(console.log);

    botLogger.log(`S3 successfully bootstraped.`);
  } catch (e) {
    botLogger.error(e, e.stack);
  }
}

export function uploadFile(opts: {
  buffer: string | Buffer;
  filePath: string;
  type?: `${string}/${string}`;
}): Promise<AWS.S3.PutObjectOutput> {
  opts.buffer = Buffer.from(opts.buffer.toString().replace(/^data:image\/\w+;base64,/, ""), "base64");

  const metaData: {
    "Content-Type": `${string}/${string}`;
  } = {
    "Content-Type": opts.type ?? "image/jpeg",
  };

  return S3Client.putObject({
    Bucket: bucketName,
    Key: `uploads/${opts.filePath}`,
    Metadata: metaData,
    Body: opts.buffer,
    ContentEncoding: "base64",
    ContentType: metaData["Content-Type"],
    ACL: "public-read",
  }).promise();
}
