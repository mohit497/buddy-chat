import { User } from "@/types";

export class Utils {
  static getAvatarUrl(user: User | undefined): string {
    if (user?.avatar && user.avatar !== "null" && user.avatar !== "undefined") {
      return user.avatar;
    }

    return "/user.png";
  }
}
