/*
 * 数据结构:
 * { id, label, data }
 * @data: 包含更多信息:
 * @marked 是否已学完
 * @tooltip 所需要的数据
 * @score 学分或进度
 */

const mockData = {
  id: '0',
  label: '前端技能树',
  children: [
    {
      id: '0-0',
      label: 'HTML',
      data: {
        marked: false,
      },
      children: [
        {
          id: '0-0-0',
          label: 'HTML5',
          data: {
            score: '33%',
          },
          children: [
            {
              id: '0-0-0-0',
              label: 'canvas',
              data: {
                marked: false,
                score: 0,
              },
            },
            {
              id: '0-0-0-1',
              label: 'websocket',
              data: {
                marked: false,
                score: 0,
              },
            },
            {
              id: '0-0-0-2',
              label: 'web worker',
              data: {
                marked: true,
                score: 100,
              },
            },
          ],
        },
      ],
    },
    {
      id: '0-1',
      label: 'css',
      children: [
        {
          id: '0-1-0',
          label: 'css3',
          children: [
            {
              d: '0-1-0',
              label: 'flex 伸缩布局',
            },
            {
              d: '0-1-1',
              label: 'transform 变形',
            },
            {
              d: '0-1-2',
              label: 'transition 过渡',
            },
            {
              d: '0-1-3',
              label: 'animation 动画',
            },
          ]
        }
      ],
    },
    {
      id: '0-2',
      label: 'js',
      children: [
        {
          id: '0-2-0',
          label: 'ES6',
          children: [
            {
              id: '0-2-0-0',
              label: 'ES6',
            },
            {
              id: '0-2-0-1',
              label: '面向对象',
            },
            {
              id: '0-2-0-2',
              label: 'this',
            },
            {
              id: '0-2-0-3',
              label: '事件循环',
            },
          ],
        },
      ],
    },
    {
      id: '0-3',
      label: '流行框架',
      children: [
        {
          id: '0-3-0',
          label: 'react',
        },
        {
          id: '0-3-1',
          label: 'vue',
        },
      ],
    },
    {
      id: '0-4',
      label: '小程序',
      children: [
        {
          id: '0-4-0',
          label: '微信小程序',
        },
        {
          id: '0-4-1',
          label: '支付宝小程序',
        },
      ],
    },
  ],
};
