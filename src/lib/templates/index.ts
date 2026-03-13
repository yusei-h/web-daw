import { TemplateData } from "@/types/daw";
import { basicTemplate } from "./basic";
import { edmTemplate } from "./edm";
import { lofiTemplate } from "./lofi";
import { rockTemplate } from "./rock";
import { jazzTemplate } from "./jazz";
import { eightBitTemplate } from "./8bit";

export type TemplateId = "basic" | "edm" | "lofi" | "rock" | "jazz" | "8bit";

export const TEMPLATES: Record<TemplateId, TemplateData> = {
  basic: basicTemplate,
  edm: edmTemplate,
  lofi: lofiTemplate,
  rock: rockTemplate,
  jazz: jazzTemplate,
  "8bit": eightBitTemplate,
};
