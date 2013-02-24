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
    this.queue = arguments[0];
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

ajs.PriorityQueue.prototype.add = function(item) {
    this.queue.push(item);
    this.heapifyUpwards(this.queue.length);
};

ajs.PriorityQueue.prototype.addAll = function() {
    var items = arguments;
    if(arguments.length == 1 && arguments[0] instanceof Array) {
        items = arguments[0];
    }
    for(var itemIndex in items) {
        this.add(items[itemIndex]);
    }
};

ajs.PriorityQueue.prototype.heapifyUpwards = function(currentIndex) {
    if(currentIndex <= 1) {
        return;
    }
    var parentIndex = Math.floor(currentIndex / 2);
    var parentItem = this.queue[parentIndex - 1];
    var currentItem = this.queue[currentIndex - 1];
    if(currentItem < parentItem) {
        this.queue[parentIndex - 1] = currentItem;
        this.queue[currentIndex - 1] = parentItem;
        this.heapifyUpwards(parentIndex);
    }
};

ajs.PriorityQueue.prototype.poll = function() {
    if(this.isEmpty()) {
        return null;
    }

    var valueToReturn = this.queue.splice(0, 1)[0];
    this.heapifyDownwards(0);
    return valueToReturn;
};

ajs.PriorityQueue.prototype.heapifyDownwards = function(currentIndex) {
    var length = this.queue.length;
    var indexOfLeftChild = (currentIndex * 2) + 1;
    var indexOfRightChild = indexOfLeftChild + 1;
    var minimumIndex;

    if(indexOfRightChild > length) {
        return;
    } else if(indexOfRightChild < length) {
        var left = this.queue[indexOfLeftChild];
        var right = this.queue[indexOfRightChild];
        minimumIndex = left < right ? indexOfLeftChild : indexOfRightChild;
    } else {
        minimumIndex = indexOfLeftChild;
    }

    if(this.queue[minimumIndex] < this.queue[currentIndex]){
        var temp = this.queue[minimumIndex];
        this.queue[minimumIndex] = this.queue[currentIndex];
        this.queue[currentIndex] = temp;
        this.heapifyDownwards(minimumIndex);
    }
};
