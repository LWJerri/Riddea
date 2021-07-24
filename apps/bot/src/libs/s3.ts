import { botLogger } from "../helpers/logger";

import AWS from "aws-sdk";

const S3Client = new AWS.S3({
  accessKeyId: process.env.S3_ACCESSKEY,
  secretAccessKey: process.env.S3_SECRETKEY,
  endpoint: process.env.S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const bucket = process.env.MINIO_BUCKET || "uploads";

function createBucket(bucketName: string) {
  return new Promise((res, rej) => {
    S3Client.createBucket(
      {
        Bucket: bucketName,
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
      if (!data?.Buckets.find((b) => b.Name === bucket)) {
        await createBucket(bucket);
      }
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
        Bucket: bucket,
        Key: opts.filePath,
        Metadata: metaData,
        Body: opts.buffer,
      },
      (err, data) => {
        if (err) rej(err);
        else res(data);
      },
    );
  });
}
