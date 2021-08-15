$(function () {
    var { isAdmin, treeGraph, utils } = createGraph.init();

    /* $.ajax({
        url: '',
        success (data) {
            treeGraph.read(mockData);
            treeGraph.fitCenter();
        },
        fail (error) {

        }
    }); */

    treeGraph.read(mockData);
    treeGraph.fitCenter();

    // 画布事件集合
    function graphEvents () {
        treeGraph.on('node:click', function (e) {
            e.item.toFront();
        });

        treeGraph.on('canvas:click', function (e) {
            // 点击画布时清除所有状态
            utils.resetGraphState();
        });
    }

    graphEvents();
});
