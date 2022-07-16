const mongoose = require("mongoose");
const SettingSchema = mongoose.Schema(
  {
    logo: {
      type: String,
      default: "",
    },
    favIcon: {
      type: String,
      default: "",
    },
    title: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
    description: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
    meta_title: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
    about_title: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
    about_description: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
    address: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
    mobile: {
      type: Number,
    },
    worktime: {
      type: String,
    },
    map: {
      type: String,
    },
    term_conditons: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
    privacy_policy: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", SettingSchema);
