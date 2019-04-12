module.export = {
    mongo: null,
    app: null,
    int: function (app, mongo) {
        this.app = app;
        this.mongo = mongo;
    }
}