
export default interface IUser {
  userID?: any | null,
  username?: string | null,
  email?: string,
  password?: string,
  role?: "USER" | "MOD" | "ADMIN",
  // role?: string,
  // roles?: Array<string>
}