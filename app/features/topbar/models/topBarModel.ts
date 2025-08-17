/*
 ────────────────────────────────────────────────────────────────────────────────
                               TopBar Model
                            -----------------------------
 This Mongoose model defines the structure for the top bar configuration 
 displayed on the website or application.

 Fields:
   title: The main title text of the top bar (required).
   button: Object containing:
       - title: Button text.
       - color: Button color.
       - link: Button URL.
   color: Background color of the top bar.
   timestamps: Automatically tracks creation and last update times.
 ────────────────────────────────────────────────────────────────────────────────
*/

import mongoose from "mongoose";

const topBarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    button: {
      title: String,
      color: String,
      link: String,
    },
    color: String,
  },
  { timestamps: true }
);

const TopBar = mongoose.models.TopBar || mongoose.model("TopBar", topBarSchema);

export default TopBar;



//────────────────────────────────────────────────────────────────────────────────