var ajs = {};

/**
 * Ascending order
 * @constructor
 */
ajs.AscendingRelationalComparator = function() {
};
ajs.AscendingRelationalComparator.prototype.compare = function(left, right) {
    if (left < right) {
        return -1;
    } else if (left > right) {
        return 1;
    } else {
        return 0;
    }
};

ajs.NegationComparator = function(delegateComparator) {
    this.delegateComparator = delegateComparator;
};
ajs.NegationComparator.prototype.compare = function(left, right) {
    return this.delegateComparator.compare(left, right) * -1;
};

ajs.DescendingRelationalComparator = function() {
    this.delegateComparator = new ajs.NegationComparator(new ajs.AscendingRelationalComparator());
};
ajs.DescendingRelationalComparator.prototype.compare = function(left, right) {
    return this.delegateComparator.compare(left, right);
};

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
        if (edge.hasSuccessorForData(targetSuccessorData)) {
            foundEdge = edge;
        }
    });
    return foundEdge;
};

/**
 * Creates a PriorityQueue. By default the queue will be in ascending order using {@link ajs.AscendingRelationalComparator}.
 * @param {Array} [initialItems] the items that should initially be placed in the queue.
 * @param {Comparator} [comparator] the comparator that will be used to order the items. The comparator should
 *                     have a method compare, that takes two arguments and returns -1, 0 or 1
 *                     when the left hand argument is less than, equal to or greater than the right
 *                     hand argument.
 * @constructor
 */
ajs.PriorityQueue = function() {
    this.queue = [];
    var items = [];
    this.comparator = new ajs.AscendingRelationalComparator();

    if (arguments.length == 1) {
        if (arguments[0] instanceof Array) {
            items = arguments[0];
        } else {
            this.comparator = arguments[0];
        }
    } else if (arguments.length === 2) {
        items = arguments[0];
        this.comparator = arguments[1];
    }
    this.addAll(items);
};

(function() {
    this.peek = function() {
        if (this.isEmpty()) {
            return null;
        }
        return this.queue[0];
    };

    this.size = function() {
        return this.queue.length;
    };

    this.isEmpty = function() {
        return this.queue.length == 0;
    };

    this.add = function(item) {
        this.queue.push(item);
        siftUp.call(this, this.queue.length);
    };

    this.addAll = function() {
        var items = arguments;
        if (arguments.length == 1 && arguments[0] instanceof Array) {
            items = arguments[0];
        }
        for (var itemIndex in items) {
            this.add(items[itemIndex]);
        }
    };

    this.poll = function() {
        if (this.isEmpty()) {
            return null;
        }

        var valueToReturn = this.queue[0];
        var lastElementIndex = this.size() - 1;
        this.queue[0] = this.queue[lastElementIndex];
        this.queue.splice(lastElementIndex, 1);
        siftDown.call(this, 0);
        return valueToReturn;
    };

    function siftUp(initialIndex) {
        var currentIndex = initialIndex;
        var topReached = false;
        while(currentIndex > 1 && !topReached) {
            var parentIndex = Math.floor(currentIndex / 2);
            var parentItem = this.queue[parentIndex - 1];
            var currentItem = this.queue[currentIndex - 1];

            if (this.comparator.compare(currentItem, parentItem) < 0) {
                this.queue[parentIndex - 1] = currentItem;
                this.queue[currentIndex - 1] = parentItem;
                currentIndex = parentIndex;
            } else {
                topReached = true;
            }
        }
    }

    function siftDown(initialIndex) {
        var length = this.queue.length;
        var currentIndex = initialIndex;

        var atEnd = false;
        while(!atEnd) {
            var indexOfLeftChild = (currentIndex * 2) + 1;
            var indexOfRightChild = indexOfLeftChild + 1;
            var minimumIndex;

            if (indexOfRightChild <= length) {
                if (indexOfRightChild < length) {
                    var left = this.queue[indexOfLeftChild];
                    var right = this.queue[indexOfRightChild];
                    minimumIndex = this.comparator.compare(left, right) < 0 ? indexOfLeftChild : indexOfRightChild;
                } else {
                    minimumIndex = indexOfLeftChild;
                }

                if (this.comparator.compare(this.queue[minimumIndex], this.queue[currentIndex]) < 0) {
                    var temp = this.queue[minimumIndex];
                    this.queue[minimumIndex] = this.queue[currentIndex];
                    this.queue[currentIndex] = temp;
                    currentIndex = minimumIndex;
                } else {
                    atEnd = true;
                }
            } else {
                atEnd = true;
            }
        }
    }
}).call(ajs.PriorityQueue.prototype);
