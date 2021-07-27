import { botLogger } from "../helpers/logger";

import AWS from "aws-sdk";

const S3Client = new AWS.S3({
  accessKeyId: process.env.S3_ACCESSKEY,
  secretAccessKey: process.env.S3_SECRETKEY,
  endpoint: process.env.S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const bucketName = process.env.MINIO_BUCKET || "uploads";

function createBucket(Bucket: string) {
  return new Promise((res, rej) => {
    S3Client.createBucket(
      {
        Bucket,
        ACL: "public-read",
      },
      (err, data) => {
        if (err) rej(err);
        else res(data);
      },
    );
  });
}

export function setupS3() {
  return new Promise((res, rej) => {
    S3Client.listBuckets(async (err, data) => {
      const bucket = data?.Buckets.find((b) => b.Name === bucketName);
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
      res(null);
    });
  });
}

export function uploadFile(opts: {
  buffer: string | Buffer;
  filePath: string;
  type?: `${string}/${string}`;
}): Promise<AWS.S3.PutObjectOutput> {
  opts.buffer = Buffer.from(opts.buffer.toString().replace(/^data:image\/\w+;base64,/, ""), "base64");

  return new Promise((res, rej) => {
    const metaData: {
      "Content-Type": `${string}/${string}`;
    } = {
      "Content-Type": opts.type ?? "image/jpeg",
    };

    S3Client.putObject(
      {
        Bucket: bucketName,
        Key: opts.filePath,
        Metadata: metaData,
        Body: opts.buffer,
        ContentEncoding: "base64",
      },
      (err, data) => {
        if (err) rej(err);
        else res(data);
      },
    );
  });
}
