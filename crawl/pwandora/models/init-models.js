var DataTypes = require("sequelize").DataTypes;
var _acceptance_checklist = require("./acceptance_checklist");
var _category = require("./category");
var _category_content = require("./category_content");
var _content = require("./content");
var _content_moderation = require("./content_moderation");
var _content_moderation_reasoning = require("./content_moderation_reasoning");
var _display = require("./display");
var _event = require("./event");
var _event_content = require("./event_content");
var _hashtag = require("./hashtag");
var _language = require("./language");
var _permission = require("./permission");
var _pwa = require("./pwa");
var _pwa_category = require("./pwa_category");
var _pwa_file = require("./pwa_file");
var _pwa_hashtag = require("./pwa_hashtag");
var _pwa_language = require("./pwa_language");
var _pwa_permission = require("./pwa_permission");
var _pwa_review = require("./pwa_review");
var _review = require("./review");
var _screenshot = require("./screenshot");
var _security = require("./security");
var _site = require("./site");
var _user = require("./user");
var _user_pwa = require("./user_pwa");

function initModels(sequelize) {
  var acceptance_checklist = _acceptance_checklist(sequelize, DataTypes);
  var category = _category(sequelize, DataTypes);
  var category_content = _category_content(sequelize, DataTypes);
  var content = _content(sequelize, DataTypes);
  var content_moderation = _content_moderation(sequelize, DataTypes);
  var content_moderation_reasoning = _content_moderation_reasoning(sequelize, DataTypes);
  var display = _display(sequelize, DataTypes);
  var event = _event(sequelize, DataTypes);
  var event_content = _event_content(sequelize, DataTypes);
  var hashtag = _hashtag(sequelize, DataTypes);
  var language = _language(sequelize, DataTypes);
  var permission = _permission(sequelize, DataTypes);
  var pwa = _pwa(sequelize, DataTypes);
  var pwa_category = _pwa_category(sequelize, DataTypes);
  var pwa_file = _pwa_file(sequelize, DataTypes);
  var pwa_hashtag = _pwa_hashtag(sequelize, DataTypes);
  var pwa_language = _pwa_language(sequelize, DataTypes);
  var pwa_permission = _pwa_permission(sequelize, DataTypes);
  var pwa_review = _pwa_review(sequelize, DataTypes);
  var review = _review(sequelize, DataTypes);
  var screenshot = _screenshot(sequelize, DataTypes);
  var security = _security(sequelize, DataTypes);
  var site = _site(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var user_pwa = _user_pwa(sequelize, DataTypes);

  category_content.belongsTo(category, { as: "category", foreignKey: "category_id"});
  category.hasMany(category_content, { as: "category_contents", foreignKey: "category_id"});
  pwa_category.belongsTo(category, { as: "category", foreignKey: "category_id"});
  category.hasMany(pwa_category, { as: "pwa_categories", foreignKey: "category_id"});
  event_content.belongsTo(event, { as: "event", foreignKey: "event_id"});
  event.hasMany(event_content, { as: "event_contents", foreignKey: "event_id"});
  pwa_hashtag.belongsTo(hashtag, { as: "hashtag", foreignKey: "hashtag_id"});
  hashtag.hasMany(pwa_hashtag, { as: "pwa_hashtags", foreignKey: "hashtag_id"});
  category_content.belongsTo(language, { as: "language", foreignKey: "language_id"});
  language.hasMany(category_content, { as: "category_contents", foreignKey: "language_id"});
  content.belongsTo(language, { as: "language", foreignKey: "language_id"});
  language.hasMany(content, { as: "contents", foreignKey: "language_id"});
  event_content.belongsTo(language, { as: "language", foreignKey: "language_id"});
  language.hasMany(event_content, { as: "event_contents", foreignKey: "language_id"});
  pwa_language.belongsTo(language, { as: "language", foreignKey: "language_id"});
  language.hasMany(pwa_language, { as: "pwa_languages", foreignKey: "language_id"});
  user.belongsTo(language, { as: "language", foreignKey: "language_id"});
  language.hasMany(user, { as: "users", foreignKey: "language_id"});
  pwa_permission.belongsTo(permission, { as: "permission", foreignKey: "permission_id"});
  permission.hasMany(pwa_permission, { as: "pwa_permissions", foreignKey: "permission_id"});
  acceptance_checklist.belongsTo(pwa, { as: "pwa", foreignKey: "pwa_id"});
  pwa.hasOne(acceptance_checklist, { as: "acceptance_checklist", foreignKey: "pwa_id"});
  content.belongsTo(pwa, { as: "pwa", foreignKey: "pwa_id"});
  pwa.hasMany(content, { as: "contents", foreignKey: "pwa_id"});
  content_moderation.belongsTo(pwa, { as: "pwa", foreignKey: "pwa_id"});
  pwa.hasOne(content_moderation, { as: "content_moderation", foreignKey: "pwa_id"});
  content_moderation_reasoning.belongsTo(pwa, { as: "pwa", foreignKey: "pwa_id"});
  pwa.hasOne(content_moderation_reasoning, { as: "content_moderation_reasoning", foreignKey: "pwa_id"});
  display.belongsTo(pwa, { as: "pwa", foreignKey: "pwa_id"});
  pwa.hasOne(display, { as: "display", foreignKey: "pwa_id"});
  event.belongsTo(pwa, { as: "pwa", foreignKey: "pwa_id"});
  pwa.hasMany(event, { as: "events", foreignKey: "pwa_id"});
  pwa_category.belongsTo(pwa, { as: "pwa", foreignKey: "pwa_id"});
  pwa.hasMany(pwa_category, { as: "pwa_categories", foreignKey: "pwa_id"});
  pwa_file.belongsTo(pwa, { as: "pwa", foreignKey: "pwa_id"});
  pwa.hasMany(pwa_file, { as: "pwa_files", foreignKey: "pwa_id"});
  pwa_hashtag.belongsTo(pwa, { as: "pwa", foreignKey: "pwa_id"});
  pwa.hasMany(pwa_hashtag, { as: "pwa_hashtags", foreignKey: "pwa_id"});
  pwa_language.belongsTo(pwa, { as: "pwa", foreignKey: "pwa_id"});
  pwa.hasMany(pwa_language, { as: "pwa_languages", foreignKey: "pwa_id"});
  pwa_permission.belongsTo(pwa, { as: "pwa", foreignKey: "pwa_id"});
  pwa.hasMany(pwa_permission, { as: "pwa_permissions", foreignKey: "pwa_id"});
  pwa_review.belongsTo(pwa, { as: "pwa", foreignKey: "pwa_id"});
  pwa.hasMany(pwa_review, { as: "pwa_reviews", foreignKey: "pwa_id"});
  screenshot.belongsTo(pwa, { as: "pwa", foreignKey: "pwa_id"});
  pwa.hasMany(screenshot, { as: "screenshots", foreignKey: "pwa_id"});
  security.belongsTo(pwa, { as: "pwa", foreignKey: "pwa_id"});
  pwa.hasOne(security, { as: "security", foreignKey: "pwa_id"});
  site.belongsTo(pwa, { as: "pwa", foreignKey: "pwa_id"});
  pwa.hasOne(site, { as: "site", foreignKey: "pwa_id"});
  user_pwa.belongsTo(pwa, { as: "pwa", foreignKey: "pwa_id"});
  pwa.hasMany(user_pwa, { as: "user_pwas", foreignKey: "pwa_id"});
  pwa_review.belongsTo(review, { as: "review", foreignKey: "review_id"});
  review.hasMany(pwa_review, { as: "pwa_reviews", foreignKey: "review_id"});
  user_pwa.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(user_pwa, { as: "user_pwas", foreignKey: "user_id"});

  return {
    acceptance_checklist,
    category,
    category_content,
    content,
    content_moderation,
    content_moderation_reasoning,
    display,
    event,
    event_content,
    hashtag,
    language,
    permission,
    pwa,
    pwa_category,
    pwa_file,
    pwa_hashtag,
    pwa_language,
    pwa_permission,
    pwa_review,
    review,
    screenshot,
    security,
    site,
    user,
    user_pwa,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
