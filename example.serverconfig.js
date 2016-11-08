var ServerConfig = function(){
    this.couchbaseSyncAddress = "http://<serverpath>:4984/<bucketname>";
}

exports.serverConfig = new ServerConfig();