/* v8 ignore start */
import { SQSClient } from "@aws-sdk/client-sqs";
import env from "./env";

export const clientSQS = new SQSClient({ region: env.AWS_REGION });
/* v8 ignore stop */