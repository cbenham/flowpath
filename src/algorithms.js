ajs = {};

(function comparators() {
    /**
     * Ascending order
     * @constructor
     */
    ajs.AscendingRelationalComparator = function() {
    };
    ajs.AscendingRelationalComparator.prototype.compare = function(left, right) {
        if(left < right) {
            return -1;
        } else if(left > right) {
            return 1;
        } else {
            return 0;
        }
    };

    /**
     * Needs documenting.
     * @constructor
     */
    ajs.CompareToComparator = function() {
    };
    ajs.CompareToComparator.prototype.compare = function(left, right) {
        return left.compareTo(right);
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
})();

(function() {

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

    /**
     * Creates a PriorityQueue. By default, ordering is handled by the {@link ajs.CompareToComparator}. A different
     * strategy may be used by supplying an alternate Comparator as the second (optional) argument to this constructor.
     * @param {Array} [initialItems] the items that should initially be placed in the queue.
     * @param {Comparator} [comparator] the comparator that will be used to order the items. The comparator should
     *                     have a method compare, that takes two arguments (the items to compare) and returns -1, 0 or 1
     *                     when the left hand argument is less than, equal to or greater than the right
     *                     hand argument.
     * @constructor
     */
    ajs.PriorityQueue = function() {
        this.queue = [];
        var items = [];
        this.comparator = new ajs.CompareToComparator();

        if(arguments.length === 1) {
            if(arguments[0] instanceof Array) {
                items = arguments[0];
            } else {
                this.comparator = arguments[0];
            }
        } else if(arguments.length === 2) {
            items = arguments[0];
            this.comparator = arguments[1];
        }
        this.addAll(items);
    };

    (function() {
        /**
         * Get the highest priority item without modifying the queue. Use {@link ajs.PriorityQueue#poll|poll} to remove
         * and retrieve and item at once.
         * @returns {Object} the item with the highest priority or null if the queue is empty.
         */
        ajs.PriorityQueue.prototype.peek = function() {
            if(this.isEmpty()) {
                return null;
            }
            return this.queue[0];
        };

        /**
         * Gets the size of the queue.
         * @returns {Number} the number of elements in the queue.
         */
        ajs.PriorityQueue.prototype.size = function() {
            return this.queue.length;
        };

        /**
         * Determines whether the queue is empty or not.
         * @returns {boolean} true if the queue is empty, false otherwise.
         */
        ajs.PriorityQueue.prototype.isEmpty = function() {
            return this.queue.length === 0;
        };

        /**
         * Clears the queue, leaving it empty.
         */
        ajs.PriorityQueue.prototype.clear = function() {
            this.queue.length = 0;
        };

        /**
         * Adds a single item to the queue. Use this method to add items of type Array.
         * To add multiple items at once consider using {@link ajs.PriorityQueue#addAll|addAll}.
         * @param item the item to add, Arrays will be added to the queue (as opposed its elements).
         */
        ajs.PriorityQueue.prototype.add = function(item) {
            this.queue.push(item);
            siftUp.call(this, this.queue.length);
        };

        /**
         * Adds multiple items to the queue. This method should be used to add the contents of an array to the queue.
         * Parameters passed as variable arguments will also be added to the queue.
         * Use {@link ajs.PriorityQueue#add|add} to add an Array as an item in the queue itself.
         * @param [...] the array of arguments or varargs whose elements will be added to the queue.
         */
        ajs.PriorityQueue.prototype.addAll = function() {
            var items = arguments;
            if(arguments.length === 1 && arguments[0] instanceof Array) {
                items = arguments[0];
            }
            for(var index = 0; index < items.length; index++) {
                this.add(items[index]);
            }
        };

        /**
         * Returns and removes the item with the highest priority.
         * @returns {Object} the next item of highest priority.
         */
        ajs.PriorityQueue.prototype.poll = function() {
            if(this.isEmpty()) {
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

                if(this.comparator.compare(currentItem, parentItem) < 0) {
                    this.queue[parentIndex - 1] = currentItem;
                    this.queue[currentIndex - 1] = parentItem;
                    currentIndex = parentIndex;
                } else {
                    topReached = true;
                }
            }
        }

        function indexOfMinimumChild(indexOfRightChild, indexOfLeftChild) {
            if(indexOfRightChild < this.queue.length) {
                var left = this.queue[indexOfLeftChild];
                var right = this.queue[indexOfRightChild];
                return this.comparator.compare(left, right) < 0 ? indexOfLeftChild : indexOfRightChild;
            } else {
                return indexOfLeftChild;
            }
        }

        function swap(indexOfMinimumItem, currentIndex) {
            var minimumItem = this.queue[indexOfMinimumItem];
            this.queue[indexOfMinimumItem] = this.queue[currentIndex];
            this.queue[currentIndex] = minimumItem;
        }

        function siftDown(initialIndex) {
            var length = this.queue.length;
            var currentIndex = initialIndex;

            var atEnd = false;
            while(!atEnd) {
                var indexOfLeftChild = (currentIndex * 2) + 1;
                var indexOfRightChild = indexOfLeftChild + 1;

                if(indexOfRightChild <= length) {
                    var indexOfMinimumItem = indexOfMinimumChild.call(this, indexOfRightChild, indexOfLeftChild);
                    if(this.comparator.compare(this.queue[indexOfMinimumItem], this.queue[currentIndex]) < 0) {
                        swap.call(this, indexOfMinimumItem, currentIndex);
                        currentIndex = indexOfMinimumItem;
                    } else {
                        atEnd = true;
                    }
                } else {
                    atEnd = true;
                }
            }
        }
    })();
})();