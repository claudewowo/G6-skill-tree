/**
 * @author 凯子凯
 * @date 2021-08-12
 */

$(function () {
    var treeGraph;

    var BaseConfig = {
        nameFontSize: 12,
        childCountWidth: 22,
        countMarginLeft: 0,
        itemPadding: 16,
        nameMarginLeft: 4,
        rootPadding: 18,
    };
    window.createGraph = {
        isAdmin: false, // 是否为管理员
        // 初始化树图
        init () {
            treeGraph = this.initGraph();
            return {
                treeGraph,
                utils,
            };
        },
        // 初始化树图函数
        initGraph () {
            var { TreeGraph, Util, Menu, Minimap, Grid, Tooltip, ToolBar } = window.G6;
            var grid = new Grid();
            var minimap = new Minimap({
                size: [200, 150],
            });
            var menu = this.createContextMenu(Menu);
            var tooltip = this.createTooltip(Tooltip);
            var toolbar = this.createToolbar(ToolBar);
            var container = document.getElementById('graph-container');
            var graph = new TreeGraph({
                container: container,
                width: container.offsetWidth,
                height: container.offsetHeight,
                modes: {
                    default: [
                        {
                            type: 'collapse-expand',
                        },
                        // 框选节点
                        {
                            type:       'brush-select',
                            brushStyle: {
                                lineWidth:   1,
                                fillOpacity: 0.1,
                                fill:        '#4088fc',
                                stroke:      '#4088fc',
                            },
                        },
                        'scroll-canvas',
                        'drag-canvas',
                    ],
                },
                defaultNode: {
                    // type: 'treeNode',
                    anchorPoints: [
                        [0, 0.5],
                        [1, 0.5],
                    ],
                },
                layout: {
                    type: 'compactBox',
                    direction: 'LR',
                    getId(d) {
                        return d.id;
                    },
                    getHeight() {
                        return 16;
                    },
                    getWidth (d) {
                        const labelWidth = Util.getTextSize(d.label, BaseConfig.nameFontSize)[0];
                        const width =
                            BaseConfig.itemPadding +
                            BaseConfig.nameMarginLeft +
                            labelWidth +
                            BaseConfig.rootPadding +
                            BaseConfig.childCountWidth;
                        return width;
                    },
                    getVGap() {
                        return 15;
                    },
                    getHGap() {
                        return 30;
                    },
                },
                plugins: [grid, menu, minimap, tooltip, toolbar],
            });

            return graph;
        },
        // 初始化右键菜单
        createContextMenu (Menu) {
            var _this = this;

            return new Menu({
                offsetX: 10,
                offsetY: -14,
                // 右击节点时显示右键菜单
                shouldBegin (e) {
                    let shouldBegin = true;

                    if (e.item) {
                        const type = e.item.get('type');

                        if (type === 'edge') {
                            shouldBegin = false;
                        } else if (type === 'node') {
                            // 管理员可以进行复制删除等操作
                            if (_this.isAdmin) {
                                shouldBegin = true;
                            } else {
                                shouldBegin = false;
                            }
                        }
                        return shouldBegin;
                    }
                },
                getContent (e) {
                    if (e.name === 'edge-shape:contextmenu') {
                        // 边
                        return `
                    <p class="menu-item" command="deleteItem">
                        <i command="deleteItem"></i>删除
                    </p>`;
                    }

                    // 节点
                    var menus = '';
                    // 右键菜单命令
                    var commands = [{
                        command: 'copyNode',
                        name: '复制节点',
                    },
                    {
                        command: 'deleteItem',
                        name: '删除节点',
                    }];

                    commands.forEach(item => {
                        menus += `<p class="menu-item" command="${item.command}">${item.name}</p>`;
                    });

                    return menus;
                },
                handleMenuClick (target, item) {
                    const command = target.getAttribute('command');

                    graphMenuCallBack[command] && graphMenuCallBack[command](item);
                },
            });
        },
        // 初始化自定义tooltip
        createTooltip (Tooltip) {
            return new Tooltip({
                offsetX: 20,
                offsetY: -20,
                itemTypes: ['node'],
                getContent (e) {
                    var outDiv = document.createElement('div');
                    outDiv.style.width = 'fit-content';
                    outDiv.innerHTML = `
                <h4>Custom Content</h4>
                <ul>
                    <li>Type: ${e.item.getType()}</li>
                </ul>
                <ul>
                    <li>Label: ${e.item.getModel().label || e.item.getModel().id}</li>
                </ul>`;
                    return outDiv;
                }
            });
        },
        // 初始化自定义工具栏
        createToolbar (Toolbar) {
            return new Toolbar({
                getContent () {
                    /* 这里必须是 ul li */
                    return `
                    <ul class="graph-toolbar">
                        <li class="iconfont icon-zoom-out" code="zoomOut" title="缩小"></li>
                        <li class="iconfont icon-zoom-in" code="zoomIn" title="放大"></li>
                        <li class="iconfont icon-1x" code="defaultSize" title="1倍大小"></li>
                        <li class="iconfont icon-why" code="graphHelp" title="1倍大小"></li>
                    </ul>
                `;
                },
                handleClick (code) {
                    toolbarCallBack[code] && toolbarCallBack[code]();
                }
            });
        }
    };

    // 工具函数
    var utils = {
        // 随机生成 nodeID
        generateNodeId () {
            return `${+new Date() + (Math.random() * 10e5).toFixed(0)}`;
        },
        // 重置画布状态
        resetGraphState () {
            treeGraph.getNodes().forEach(item => {
                item.clearState();
            });
            treeGraph.getEdges().forEach(item => {
                item.clearState();
            });
        },
        // 保存画布
        save () {
            $.ajax({
                url: '',
                dataType: 'json',
                data: treeGraph.save(),
                fail (error) {
                    console.log(error);
                }
            });
        },
    };

    // 技能树右键菜单回调映射
    var graphMenuCallBack = {
        copyNode (item) {
            const model = item.getModel();

            treeGraph.addItem('node', {
                ...model,
                id: methods.generateNodeId(),
                x: model.x + 20,
                y: model.y + 20,
            });
            // 保存当前画布
            utils.save();
        },
        // 删除节点和边
        deleteItem (item) {
            const isEdge = item.get('type') === 'edge';

            if (isEdge) {
                treeGraph.removeChild(item);
                utils.save();
            } else {
                $alert('确定要删除该节点吗? 此操作不可撤销!', '警告', {
                    type: 'warning',
                }).then(action => {
                    if (action === 'confirm') {
                        treeGraph.removeChild(item);
                        utils.save();
                    }
                });
            }
        },
        /* 键盘快捷键删除节点 */
        removeNode (e, callback) {
            if ((e && (e.keyCode === 8 || e.keyCode === 46)) || callback) {
                $confirm('确定要删除该节点吗?', '警告', {
                    type: 'warning',
                    beforeClose (action, instance, done) {
                        if (action === 'confirm') {
                            callback(true);
                            utils.resetGraphState();
                            utils.save();
                        }
                        done();
                    },
                });
            }
        },

        removeEdge (callback) {
            $confirm('确定要删除这条边吗?', '警告', {
                type: 'warning',
                beforeClose (action, instance, done) {
                    if (action === 'confirm') {
                        callback(true);
                        utils.resetGraphState();
                        utils.save();
                    }
                    done();
                },
            });
        },
    };

    // 功能栏回调
    var toolbarCallBack = {
        defaultSize () {
            treeGraph.zoomTo(1);
        },
        // 缩小
        zoomOut () {
            treeGraph.zoom(0.9);
        },
        // 放大
        zoomIn () {
            treeGraph.zoom(1.1);
        },
        graphHelp () {
            $('#toolbar-help').show(300);
        },
    };

    $('.dialog-container .icon-failed').on('click', function () {
        $(this).parents('.dialog').hide(300);
    });
});
