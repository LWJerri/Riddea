import * as Minio from 'minio'
import { botLogger } from '../helpers/logger'

const S3Client = new Minio.Client({
  accessKey: process.env.MINIO_ACCESSKEY,
  secretKey: process.env.MINIO_SECRETKEY,
  endPoint: process.env.MINIO_ENDPOINT,
  port: process.env.MINIO_PORT ? Number(process.env.MINIO_PORT) : 9000,
  useSSL: true
})

const bucket = process.env.MINIO_BUCKET || 'uploads'

function createBucket(bucket: string) {
  return new Promise((res, rej) => {
    S3Client.makeBucket(bucket, 'local', (err) => {
      if (err) rej(err)
      else res(null)
    })
  })
}

export async function setupMinio() {
  if (!await S3Client.bucketExists(bucket)) {
    await createBucket(bucket)
  }
  
  await S3Client.setBucketPolicy(bucket, JSON.stringify({
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          AWS: ['*'],
        },
        Action: [
          's3:GetObject',
        ],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  }))

  botLogger.log(`Minio successfully bootstraped.`)
}

export function uploadFile(opts: { buffer: string | Buffer, filePath: string, type?: `${string}/${string}` }): Promise<string> {
  opts.buffer = Buffer.from(opts.buffer.toString().replace(/^data:image\/\w+;base64,/, ""), 'base64');

  return new Promise((res, rej) => {
    const metaData: {
      'Content-Type': `${string}/${string}`,
    } = {
      'Content-Type': opts.type ?? 'image/jpeg',
    };

    S3Client.putObject(
      bucket,
      opts.filePath,
      opts.buffer,
      metaData as any,
      (err, data) => {
        if (err) rej(err)
        else res(data)
      },
    ) as any;
  })
}