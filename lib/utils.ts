import { auth } from '@clerk/nextjs/server';

export const getRole = async () => {
  const { userId, sessionClaims } = await auth();
  const role_value = (sessionClaims?.metadata as { role?: string })
    ?.role as string;
  const currentUserId = userId as string;
  return { role: role_value, userId: currentUserId };
};
