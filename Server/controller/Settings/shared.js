const siteData = (req) => {
  return {
    mobile: req.body.mobile,
    "address.en": req.body.address_en,
    "address.ar": req.body.address_ar,
    "description.en": req.body.description_en,
    "description.ar": req.body.description_ar,
    logo: req.files && req.files.logo ? req.files.logo[0].path : req.body.logo,
    favIcon:
      req.files && req.files.favIcon
        ? req.files.favIcon[0].path
        : req.body.favIcon,
    "title.en": req.body.title_en,
    "title.ar": req.body.title_ar,
    worktime: req.body.worktime,
    map: req.body.map,
    "meta_title.en": req.body.meta_title_en,
    "meta_title.ar": req.body.meta_title_ar,
    "about_title.en": req.body.about_title_en,
    "about_title.ar": req.body.about_title_ar,
    "about_description.en": req.body.about_description_en,
    "about_description.ar": req.body.about_description_ar,
    "term_conditons.en": req.body.term_conditons_en,
    "term_conditons.ar": req.body.term_conditons_ar,
    "privacy_policy.en": req.body.privacy_policy_en,
    "privacy_policy.ar": req.body.privacy_policy_ar,
  };
};

module.exports = { siteData };
