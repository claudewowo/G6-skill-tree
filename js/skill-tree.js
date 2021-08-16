$(function () {
    var { isAdmin, treeGraph, utils } = createGraph.init();

    // 数据结构预处理
    function dataPreProcess (data, depth) {
        data.depth = depth;
        if (data.children && data.children.length) {
            depth++;
            data.children.forEach(function (child) {
                child.depth = depth;

                dataPreProcess(child, depth);
            });
        }
    }

    // 技能过滤
    function skillsFilter () {
        var skill_input = $('#skill_input'),
            skillTree = $('#skill-tree');

        // 初始化dom数据
        skillTree.append(`<ul id="tree-leaf-0" data-id="0" class="tree-leaf-ul hidden">
            <li class="tree-leaf" data-id="${mockData.id}">
                ${mockData.label}
                <i class="iconfont icon-arrow-right"></i>
            </li>
        </ul>`);

        // 默认显示第1列
        skill_input.on('focus', function () {
            $('#tree-leaf-0').removeClass('hidden');
        });
        skill_input.on('blur', function () {
            setTimeout(function () {
                $('.tree-leaf-ul').addClass('hidden');
            }, 200);
        });
        // 点击叶子节点
        skillTree.on('click', '.tree-leaf', function () {
            var _this = $(this);

            _this.addClass('selected').siblings().removeClass('selected');
            skillTree.find('.tree-leaf-ul').addClass('hidden');

            var html = '';
            var arr = skillTree.find('.tree-leaf.selected');

            if (arr.length === 1) {
                html = $(arr[0]).text().trim();
            } else {
                var array = [];

                for (var i = 0; i < arr.length; i++) {
                    var item = $(arr[i]);

                    array.push(item.text().trim());
                }
                html = array.join(' / ');
            }
            skill_input.val(html);

            if (html) {
                // 重新渲染画布
                var newTreeData = utils.findById(_this.attr('data-id'), mockData);

                treeGraph.changeData(newTreeData);
                treeGraph.fitCenter();
            }
        });
        // 鼠标移入叶子节点需要重新渲染子列表
        skillTree.on('mouseenter', '.tree-leaf', function () {
            var id = $(this).attr('data-id');
            var leaf = utils.findById(id, mockData);
            var depth = +leaf.depth + 1;

            $(this).addClass('selected').siblings().removeClass('selected');

            if (leaf.children && leaf.children.length) {
                var ulId = 'tree-leaf-' + depth;
                var ul = $('#' + ulId);

                if (ul.length === 0) {
                    skillTree.append(`<ul id="${ulId}" data-id="${depth}" class="tree-leaf-ul"></ul>`);
                }

                var innerHTML = '';
                leaf.children.forEach(el => {
                    innerHTML += '<li class="tree-leaf" data-id="' + el.id + '">' + el.label + '<i class="iconfont icon-arrow-right"></i></li>';
                });
                $('#' + ulId).html(innerHTML);
                $('#' + ulId).removeClass('hidden');
            }

            setTimeout(function () {
                // 鼠标回到上级菜单时要隐藏后面的列表
                var treeLeafUl = skillTree.find('.tree-leaf-ul');

                for (var i = 0; i < treeLeafUl.length; i++) {
                    if (i > depth) {
                        $(treeLeafUl[i]).addClass('hidden');
                    }
                }
            }, 200);
        });
    }

    // 画布事件集合
    function graphBindEvents () {
        treeGraph.on('node:click', function (e) {
            e.item.toFront();
        });

        treeGraph.on('canvas:click', function (e) {
            // 点击画布时清除所有状态
            utils.resetGraphState();
        });
    }

    /* $.ajax({
        url: '',
        success (data) {
            dataPreProcess(data, 0);
            skillsFilter();

            treeGraph.read(JSON.parse(JSON.stringify(mockData)));
            treeGraph.fitCenter();
            graphBindEvents();
        },
        fail (error) {

        }
    }); */

    dataPreProcess(mockData, 0);
    skillsFilter();
    treeGraph.read(JSON.parse(JSON.stringify(mockData)));
    treeGraph.fitCenter();

    graphBindEvents();
});
