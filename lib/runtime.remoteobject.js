var Q = require("q");

function RemoteObject(type, value, objectId) {
    this.type = type;
    this.value = value;
    this.objectId = objectId;

    if(this.objectId) {
      this._updateObjectId();
    }
}

RemoteObject.prototype = {

    _updateObjectId: function() {
        var extractedId = this.objectId.match(/conn(.*).obj(.*)/)[2];
        this.objectId = parseInt(extractedId, 10);
    }

};

module.exports = RemoteObject;
