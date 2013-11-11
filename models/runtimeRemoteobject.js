var Q = require("q");

function RuntimeRemoteObject(type, value, objectId) {
    this.type = type;
    this.value = value;
    this.objectId = objectId;

    if(this.objectId) {
      this._updateObjectId();
    }
}

RuntimeRemoteObject.prototype = {

    _updateObjectId: function() {
        var extractedId = this.objectId.match(/conn(.*).obj(.*)/)[2];
        this.objectId = parseInt(extractedId, 10);
    }

};

module.exports = RuntimeRemoteObject;
