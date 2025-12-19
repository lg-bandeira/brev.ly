import Hashids from "hashids";
import { env } from "../env";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Base 62
const hashids = new Hashids(env.HASHIDS_SALT, 5, alphabet); // 5-character code -> 62^5 = 916.132.832 urls

export function encode(num: number): string {
  return hashids.encode(num);
}
