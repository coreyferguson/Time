
class StatusController {

  status(event) {
    return Promise.resolve({ statusCode: 200 });
  }

}

module.exports = new StatusController();
