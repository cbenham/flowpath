describe("DirectedGraph", function() {
    xit("should be able to find the shortest path in a graph of only two nodes", function() {
        var predecessor = new fp.Node("predecessor");
        var successor = new fp.Node("successor");
        predecessor.connectTo([successor]);

        var graph = new fp.DirectedGraph([predecessor, successor]);
        graph.shortestPath();
    });
}) ;

describe("Node", function() {

    var predecessor, successor;

    beforeEach(function() {
        predecessor = new fp.Node("predecessor");
        successor = new fp.Node("successor");
    });

    it("should have a weighted connection between a predecessor and successor", function() {
        predecessor.connectTo(successor, 45);

        var actualEdge = predecessor.findEdgeTo("successor");
        expect(actualEdge.predecessor).toBe(predecessor);
        expect(actualEdge.successor).toBe(successor);
    });

    it("should not have a connection to a disconnected node", function() {
        var predecessor = new fp.Node("predecessor");

        expect(predecessor.findEdgeTo("successor")).toBeNull();
    });
});

describe("Edge", function() {
    var predecessor, successor;

    beforeEach(function() {
        predecessor = new fp.Node("predecessor");
        successor = new fp.Node("successor");
    });

    it("should indicate that it has successor node when the data matches", function() {
        var edge = new fp.Edge(predecessor, successor, 33);

        expect(edge.hasSuccessorForData("successor")).toEqual(true);
    });

    it("should not indicate that it has a successor node when the data does not match", function() {
        var alternate = new fp.Node("alternate");

        var edge = new fp.Edge(predecessor, successor, 33);

        expect(edge.hasSuccessorForData("alternate")).toEqual(false);
    });
});
