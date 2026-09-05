import { homepage } from "./homepage.js";
import { quietEditorial } from "./quiet-editorial.js";
import { blank } from "./blank.js";

// Add future experiments here. Each page is data; shared markup stays in components/.
export const pages = {
  homepage,
  "quiet-editorial": quietEditorial,
  blank,
};
