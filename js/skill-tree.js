$(function () {
    var { treeGraph } = createGraph.init();

    console.log(mockData);
    treeGraph.read(mockData);
    treeGraph.fitCenter();
});
