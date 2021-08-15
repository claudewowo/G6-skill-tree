const mockData = {
  id: '0',
  label: '前端技能树',
  children: [
    {
      id: '0-1',
      label: '自然人',
      subTypeCount: 1,
      children: [
        {
          id: '0-1-0',
          label: '电影人',
          subTypeCount: 3,
          children: [
            {
              id: '0-1-0-0',
              label: '电影导演',
              subTypeCount: 0,
              children: [],
            },
            {
              id: '0-1-0-1',
              label: '电影编剧',
              subTypeCount: 0,
              children: [],
            },
            {
              id: '0-1-0-2',
              label: '电影主演',
              subTypeCount: 0,
              children: [],
            },
          ],
        },
        {
          id: '0-1-1',
          label: '音乐人',
          subTypeCount: 2,
          children: [],
        },
      ],
    },
    {
      id: '0-2',
      label: '音乐',
      subTypeCount: 2,
      children: [],
    },
    {
      id: '0-3',
      label: '电影',
      subTypeCount: 0,
      children: [
        {
          id: '0-3-0',
          label: '喜剧',
          subTypeCount: 0,
          children: [],
        },
      ],
    },
    {
      id: '0-4',
      label: '电影类别',
      subTypeCount: 0,
      children: [],
    },
    {
      id: '0-5',
      label: '机构',
      subTypeCount: 1,
      children: [
        {
          id: '0-5-0',
          label: '公司',
          subTypeCount: 2,
          children: [
            {
              id: '0-5-0-0',
              label: '电影公司',
              subTypeCount: 0,
              children: [],
            },
            {
              id: '0-5-0-1',
              label: '音乐公司',
              subTypeCount: 0,
              children: [],
            },
          ],
        },
      ],
    },
  ],
};
