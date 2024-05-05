import type { Logger } from "pino";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      id: string;
      message: string;
    }
    interface Locals {
      requestID: string;
      logger: Logger<string>;
      userID: string;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}
