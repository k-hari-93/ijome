import { type User } from "@clerk/nextjs/dist/types/server/clerkClient";

export default function filterUserFieldsForClient(user: User) {
  return { id: user.id, username: user.username, profileImage: user.imageUrl };
}
