const getKeys = (req) => {
  return {
    "title.en": req.body.title_en,
    "title.ar": req.body.title_ar,
    "description.en": req.body.description_en,
    "description.ar": req.body.description_ar,
    image: req.file ? req.file.path : req.body.image,
  };
};

module.exports = { getKeys };
