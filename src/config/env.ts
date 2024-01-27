import { config } from 'dotenv';
import { z } from 'zod';

config({
	path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
	TZ: z.string().default('America/São Paulo'),
	PORT: z.coerce.number().default(3000),

	DB_TYPE: z.enum(['mysql', 'postgres']).default('mysql'),
	DB_HOST: z.string(),
	DB_PORT: z.coerce.number().default(3306),
	DB_USERNAME: z.string(),
	DB_PASSWORD: z.string(),
	DB_DATABASE: z.string(),

	JWT_KEY: z.string(),

	QUEUE_CREATE_ORDER_URL: z.string(),
	QUEUE_UPDATE_ORDER_URL: z.string(),
	AWS_REGION: z.string(),
});

const envTestSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
	TZ: z.string().default('America/São Paulo'),
	PORT: z.coerce.number().default(3000),

	DB_TYPE: z.enum(['mysql', 'postgres']).default('mysql'),
	DB_HOST: z.string().optional(),
	DB_PORT: z.coerce.number().default(3306),
	DB_USERNAME: z.string().optional(),
	DB_PASSWORD: z.string().optional(),
	DB_DATABASE: z.string().optional(),

	JWT_KEY: z.string().default('test'),

	QUEUE_CREATE_ORDER_URL: z.string().optional(),
	QUEUE_UPDATE_ORDER_URL: z.string().optional(),
	AWS_REGION: z.string().optional(),
});

const getEnv = () => {
	if (process.env.NODE_ENV === 'test') return envTestSchema.parse(process.env);
	return envSchema.parse(process.env);
};

const env = getEnv();

export default env;
