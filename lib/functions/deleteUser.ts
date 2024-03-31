import { lucia } from "../lucia/lucia.js";
import User from "../mongo/user.js";

async function deleteSessionUser(userId: string) {
  await lucia.invalidateUserSessions(userId)
  await lucia.deleteExpiredSessions();

  User.findByIdAndDelete(userId)
    .catch(error => {
      console.error("Error deleting user:", error);
    });
}

export default deleteSessionUser
