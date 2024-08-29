import type { AvailableLanguageTag } from "$lib/paraglide/runtime";
import type { ParaglideLocals } from "@inlang/paraglide-sveltekit";
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
      paraglide: ParaglideLocals<AvailableLanguageTag>;
    }

    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}
