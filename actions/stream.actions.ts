"use server";

import { currentUser } from '@clerk/nextjs/server';
import { StreamClient } from '@stream-io/node-sdk';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

export const tokenProvider = async () => {
  const user = await currentUser();
  if (!user) throw new Error('No user logged in 😕😕');
  if (!apiKey) throw new Error('No Stream API Key provided');
  if (!apiSecret) throw new Error('No Stream API Secret provided');

  const client = new StreamClient(apiKey, apiSecret);

  const newUser = {
    id: user.id,
    role: 'user',
    custom: {
      color: 'red',
    },
    name: user.username || "Guest", // Provide a default value when username is null
    image: user.imageUrl,
  };

  await client.upsertUsers([newUser]);
  const validity = 60 * 60;
  const token = await client.generateUserToken({
    user_id: user.id,
    validity_in_seconds: validity,
  });

  return token;
};
