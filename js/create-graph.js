/**
 * @author 凯子凯
 * @date 2021-08-12
 */

$(function () {
    var treeGraph;

    var BaseConfig = {
        itemPadding: 10,
        nameFontSize: 12,
        childCountWidth: 22,
        countMarginLeft: 10,
        nameMarginLeft: 10,
        nodeMinWidth: 50,
        rootPadding: 15,
    };
    window.createGraph = {
        isAdmin: false, // 是否为管理员
        // 初始化树图
        init () {
            treeGraph = this.initGraph();
            return {
                isAdmin: this.isAdmin,
                treeGraph,
                utils,
            };
        },
        // 初始化树图函数
        initGraph () {
            var { TreeGraph, Util, Menu, Minimap, Grid, Tooltip, ToolBar, registerEdge, registerNode } = window.G6;
            var grid = new Grid();
            var minimap = new Minimap({
                size: [200, 150],
            });
            var menu = this.createContextMenu(Menu);
            var tooltip = this.createTooltip(Tooltip);
            var toolbar = this.createToolbar(ToolBar);
            var container = $('#graph-container')[0];

            // 注册自定义边
            this.registerEdge(registerEdge, Util);
            // 注册自定义节点
            this.registerNode(registerNode, Util);

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
                    type: 'treeNode',
                    anchorPoints: [
                        [0, 0.5],
                        [1, 0.5],
                    ],
                },
                defaultEdge: {
                    type: 'smooth-edge',
                },
                nodeStateStyles: {
                    selected: {
                        lineWidth: 2,
                        fill:      '#4483FF',
                        labelCfg:  {
                            style: {
                                fill:       '#fff',
                                fontWeight: 'bold',
                            },
                        },
                    },
                    highlight: {
                        lineWidth: 1,
                        fill:      '#f85564',
                        stroke:    '#f85564',
                        labelCfg:  {
                            style: {
                                fill:       '#fff',
                                fontWeight: 'bold',
                            },
                        },
                    },
                },
                layout: {
                    type: 'mindmap',
                    direction: 'H',
                    getHeight() {
                        return 16;
                    },
                    getWidth (d) {
                        var labelWidth = Util.getTextSize(d.label, BaseConfig.nameFontSize)[0];
                        var width = BaseConfig.itemPadding + labelWidth + BaseConfig.childCountWidth;

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
                    var shouldBegin = true;

                    if (e.item) {
                        var type = e.item.get('type');

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
                    <p class="menu-item" command="devareItem">
                        <i command="devareItem"></i>删除
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
                        command: 'devareItem',
                        name: '删除节点',
                    }];

                    commands.forEach(item => {
                        menus += `<p class="menu-item" command="${item.command}">${item.name}</p>`;
                    });

                    return menus;
                },
                handleMenuClick (target, item) {
                    var command = target.getAttribute('command');

                    graphMenuCallBack[command] && graphMenuCallBack[command](item);
                },
            });
        },
        // 初始化自定义tooltip
        createTooltip (Tooltip) {
            /*
             * 重写隐藏功能
             * 加了延时隐藏功能
             */
            Tooltip.prototype.hideTooltip = function () {
                var _this = this;
                var tooltip = $('.g6-component-tooltip');

                setTimeout(function () {
                    // 鼠标不在当前元素上时才能隐藏
                    if (!_this.currentTarget) {
                        tooltip.css({
                            visibility: 'hidden',
                            display: 'none'
                        });
                    }
                }, 300);
            };
            return new Tooltip({
                offsetX: 30,
                offsetY: -20,
                itemTypes: ['node'],
                shouldBegin (e) {
                    var model = e.item.getModel();

                    return model.depth > 0;
                },
                getContent (e) {
                    var model = e.item.getModel();

                    var outDiv = document.createElement('div');
                    outDiv.style.width = 'fit-content';
                    outDiv.innerHTML = `
                        ${ model.data && model.data.score ? `<h4 class="tooltip-title">我的测试成绩: ${ model.data.score }分</h4>` : '' }
                        <ul>
                            <li>
                                你还没获得过此项技能, 快去参加<a class="go-test" href="##" target="_blank">考试 <i class="iconfont icon-new-tab"></i></a>吧
                            </li>
                            <li>
                                <p class="mt15">有疑问? 找组织:</p>
                                <img class="QR-code" src="./iShot2021-08-15_07.23.56.png" />
                            </li>
                        </ul>
                    `;
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
                        <li class="iconfont icon-zoom-in" code="zoomIn" title="放大"></li>
                        <li class="iconfont icon-zoom-out" code="zoomOut" title="缩小"></li>
                        <li class="iconfont icon-1x" code="defaultSize" title="1倍大小"></li>
                        <li class="iconfont icon-why" code="graphHelp" title="1倍大小"></li>
                    </ul>
                `;
                },
                handleClick (code) {
                    toolbarCallBack[code] && toolbarCallBack[code]();
                }
            });
        },
        // 自定义边
        registerEdge (registerEdge) {
            registerEdge('smooth-edge', {
                draw(cfg, group) {
                    var { startPoint, endPoint } = cfg;
                    var hgap = endPoint.x - startPoint.x;
                    var path = [
                        ['M', startPoint.x, startPoint.y],
                        [
                            'C',
                            startPoint.x + hgap / 4,
                            startPoint.y,
                            endPoint.x - hgap / 2,
                            endPoint.y,
                            endPoint.x,
                            endPoint.y,
                        ],
                    ];

                    var shape = group.addShape('path', {
                        attrs: {
                            stroke: '#AAB7C4',
                            path,
                        },
                        name: 'smooth-path-shape',
                    });

                    return shape;
                },
            });
        },
        // 自定义节点
        registerNode (registerNode, Util) {
            registerNode('treeNode', {
                draw(cfg, group) {
                    var { label, collapsed, data, selected, children, depth } = cfg;
                    var rootNode = depth === 0;
                    var hasChildren = children && children.length;
                    var isRight = cfg.x > 0;

                    var {
                        childCountWidth,
                        countMarginLeft,
                        nameMarginLeft,
                        itemPadding,
                        rootPadding,
                    } = BaseConfig;

                    var width = 0;
                    var height = 28;
                    var x = 0;
                    var y = 0;
                    // var y = -height / 2;

                    var textWidth = Util.getTextSize(String(label), 12)[0];
                    var nodeWidth = textWidth + itemPadding + nameMarginLeft;

                    width = nodeWidth < BaseConfig.nodeMinWidth ? BaseConfig.nodeMinWidth : nodeWidth;

                    if (!rootNode && hasChildren) {
                        width += countMarginLeft;
                        width += childCountWidth;
                    }

                    var keyShapeAttrs = {
                        x,
                        y,
                        width,
                        height,
                        radius: 4,
                    };

                    // keyShape根节点选中样式
                    if (rootNode && selected) {
                        keyShapeAttrs.fill = '#e8f7ff';
                        keyShapeAttrs.stroke = '#e8f7ff';
                    }
                    var keyShape = group.addShape('rect', {
                        attrs: keyShapeAttrs,
                        name: 'root-key-shape-rect-shape',
                    });

                    var mainX = x;
                    var mainY = 0;

                    if (rootNode) {
                        group.addShape('rect', {
                            attrs: {
                                x: mainX,
                                y: mainY,
                                width,
                                height,
                                radius: 14,
                                fill: '#e8f7ff',
                                cursor: 'pointer',
                            },
                            name: 'main-shape',
                        });
                    }

                    var nameColor = 'rgba(0, 0, 0, .65)';

                    if (selected) {
                        nameColor = '#40A8FF';
                    }

                    // 名称
                    if (rootNode) {
                        // 根节点
                        group.addShape('text', {
                            attrs: {
                                text: label,
                                x: mainX + 10,
                                y: height / 2,
                                textAlign: 'left',
                                textBaseline: 'middle',
                                fill: nameColor,
                                fontSize: 12,
                                fontFamily: 'PingFangSC-Regular',
                                cursor: 'pointer',
                            },
                            name: 'root-text-shape',
                        });
                    } else {
                        // 其他节点
                        group.addShape('text', {
                            attrs: {
                                text: label,
                                textAlign: 'start',
                                textBaseline: 'top',
                                fill: nameColor,
                                fontSize: 12,
                                fontFamily: 'PingFangSC-Regular',
                                cursor: 'pointer',
                                x: isRight ? mainX + 16 : width - textWidth,
                                y: 0,
                            },
                            name: 'not-root-text-shape',
                        });
                        // 名称前面加个图标
                        group.addShape('text', {
                            attrs: {
                                text: data && data.marked ? '\ue708' : '\ue616',
                                fontFamily: 'iconfont',
                                fill: data && data.marked ? '#333' : '#aaa',
                                fontSize: 12,
                                x: isRight ? 2 : width - textWidth - 14,
                                y: 12,
                            },
                        });
                        // 底部横线
                        group.addShape('path', {
                            attrs: {
                                path: [
                                    ['M', isRight ? x : x, height / 2],
                                    ['L', width, height / 2],
                                ],
                                stroke: '#AAB7C4',
                                lineWidth: 1,
                            },
                            name: 'node-path-shape',
                        });

                        keyShape.toFront();

                    }

                    // 子类数量
                    if (hasChildren && !rootNode) {
                        var childCountHeight = 12;
                        var childCountX = width - childCountWidth;
                        var childCountY = -childCountHeight / 2;

                        group.addShape('rect', {
                            attrs: {
                                width: childCountWidth,
                                height: 12,
                                stroke: collapsed ? '#1890ff' : '#5CDBD3',
                                fill: collapsed ? '#fff' : '#E6FFFB',
                                x: isRight ? childCountX : 0,
                                y: 8,
                                radius: 6,
                                cursor: 'pointer',
                            },
                            name: 'child-count-rect-shape',
                        });
                        group.addShape('text', {
                            attrs: {
                                text: `${children?.length}`,
                                fill: 'rgba(0, 0, 0, .65)',
                                fontSize: 10,
                                width: childCountWidth,
                                textAlign: 'center',
                                cursor: 'pointer',
                                x: isRight ? childCountX + childCountWidth / 2 : childCountWidth / 2,
                                y: 20,
                            },
                            name: 'child-count-text-shape',
                        });
                    }

                    return keyShape;
                },
            });
        },
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
                item.clearStates();
            });
            treeGraph.getEdges().forEach(item => {
                item.clearStates();
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
            var model = item.getModel();

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
        devareItem (item) {
            var isEdge = item.get('type') === 'edge';

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
            $('#toolbar-help').fadeIn(300);
        },
    };

    $('.dialog-container .icon-failed').on('click', function () {
        $(this).parents('.dialog').fadeOut(300);
    });
});
