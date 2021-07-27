import { botLogger } from "../helpers/logger";

import AWS from "aws-sdk";

const S3Client = new AWS.S3({
  accessKeyId: process.env.S3_ACCESSKEY,
  secretAccessKey: process.env.S3_SECRETKEY,
  endpoint: process.env.S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const bucketName = process.env.S3_BUCKET || "uploads";

function createBucket(Bucket: string) {
  return S3Client.createBucket({ Bucket }).promise();
}

export async function setupS3() {
  try {
    const buckets = await S3Client.listBuckets().promise();
    const bucket = buckets?.Buckets?.find((b) => b.Name === bucketName);

    if (!bucket) {
      await createBucket(bucketName);
    }

    await S3Client.putBucketPolicy({
      Bucket: bucket.Name,
      Policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              AWS: ["*"],
            },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucket}/*`],
          },
        ],
      }),
    }).promise();
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
    Key: opts.filePath,
    Metadata: metaData,
    Body: opts.buffer,
    ContentEncoding: "base64",
  }).promise();
}
