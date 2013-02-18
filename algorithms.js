var ajs = {};

ajs.Edge = function(predecessor, successor, weight) {
    this.predecessor = predecessor;
    this.successor = successor;
    this.weight = weight;
};
ajs.Edge.prototype.hasSuccessorForData = function(targetData) {
    return this.successor.data === targetData;
};

ajs.Node = function(data) {
    this.data = data;
    this.adjacencies = [];
};
ajs.Node.prototype.connectTo = function(successorNode, weight) {
    var edge = new ajs.Edge(this, successorNode, weight);
    this.adjacencies.push(edge);
};
ajs.Node.prototype.findEdgeTo = function(targetSuccessorData) {
    var foundEdge = null;
    this.adjacencies.forEach(function(edge) {
        if(edge.hasSuccessorForData(targetSuccessorData)) {
            foundEdge = edge;
        }
    });
    return foundEdge;
};

ajs.PriorityQueue = function() {
    this.queue = [];
    var seedData = arguments[0];
    for(var index in seedData) {
        this.queue.push(arguments[0][index]);
    }
};

ajs.PriorityQueue.prototype.peek = function() {
    return this.queue[0];
};

ajs.PriorityQueue.prototype.size = function() {
    return this.queue.length;
};

ajs.PriorityQueue.prototype.isEmpty = function() {
    return this.queue.length == 0;
};
