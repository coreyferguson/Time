
const Base64 = require('js-base64').Base64;

class PageAssembler {

  toCursor(page, queryOptions) {
    const model = {};
    if (page.LastEvaluatedKey) {
      model.cursor = Base64.encode(JSON.stringify({
        lastEvaluatedKey: page.LastEvaluatedKey,
        queryOptions: queryOptions
      }))
      model.hasAfter = true;
    } else {
      model.hasAfter = false;
    }
    return model;
  }

  fromCursor(cursor) {
    cursor = Base64.decode(cursor);
    cursor = JSON.parse(cursor);
    return { ...cursor.queryOptions, after: cursor.lastEvaluatedKey };
  }

}

module.exports = new PageAssembler();
module.exports.PageAssembler = PageAssembler;
