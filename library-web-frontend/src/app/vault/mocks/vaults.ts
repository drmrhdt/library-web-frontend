export const vaults = [
    {
        id: '1',
        name: 'Хранилище 1',
        description: 'Описание 1',
        rows: 2,
        books: 9,
        shelfs: {
            shelfs: [
                {
                    number: 1,
                    rows: [
                        {
                            number: 1,
                            books: [
                                {
                                    name: 'Ник',
                                    author: 'Ник Ясинский',
                                    number: '1'
                                },
                                {
                                    name: 'Война и мир. Том 1',
                                    author: 'Лев Толстой',
                                    number: '2'
                                },
                                {
                                    name: 'Война и мир. Том 2',
                                    author: 'Лев Толстой',
                                    number: '3'
                                },
                                {
                                    name: 'Война и мир. Том 3',
                                    author: 'Лев Толстой',
                                    number: '4'
                                }
                            ]
                        },
                        {
                            number: 2,
                            books: [
                                {
                                    name: 'Ник. Юзер',
                                    author: 'Ник Ясинский',
                                    number: '2'
                                }
                            ]
                        }
                    ]
                },
                {
                    number: 2,
                    rows: [
                        {
                            number: 1,
                            books: [
                                {
                                    name: 'Ник. Стихийник',
                                    author: 'Ник Ясинский',
                                    number: '1'
                                }
                            ]
                        },
                        {
                            number: 2,
                            books: [
                                {
                                    name: 'Ник. Админ',
                                    author: 'Ник Ясинский',
                                    number: '2'
                                }
                            ]
                        }
                    ]
                },
                {
                    number: 3,
                    rows: [
                        {
                            number: 1,
                            books: [
                                {
                                    name: 'Унесенные ветром 1',
                                    author: 'Маргарет Митчелл',
                                    number: '1'
                                }
                            ]
                        },
                        {
                            number: 2,
                            books: [
                                {
                                    name: 'Унесенные ветром 2',
                                    author: 'Маргарет Митчелл',
                                    number: '1'
                                }
                            ]
                        }
                    ]
                }
            ]
        }

        // books: {
        //   number: 5,
        //   books: [
        //     {
        //       name: 'Ник',
        //       author: 'Ник Ясинский',
        //       vault: '1',
        //       shelf: '1',
        //       row: '1',
        //       number: '1',
        //     },
        //     {
        //       name: 'Ник. Юзер',
        //       author: 'Ник Ясинский',
        //       vault: '1',
        //       shelf: '1',
        //       row: '1',
        //       number: '2',
        //     },
        //     {
        //       name: 'Ник. Стихийник',
        //       author: 'Ник Ясинский',
        //       vault: '1',
        //       shelf: '1',
        //       row: '1',
        //       number: '3',
        //     },
        //     {
        //       name: 'Ник. Админ',
        //       author: 'Ник Ясинский',
        //       vault: '1',
        //       shelf: '1',
        //       row: '1',
        //       number: '4',
        //     },
        //     {
        //       name: 'Ник. Землянин',
        //       author: 'Ник Ясинский',
        //       vault: '1',
        //       shelf: '1',
        //       row: '2',
        //       number: '1',
        //     },
        //   ],
        // },
    },
    {
        id: '2',
        name: 'Хранилище 2',
        description: 'Описание 2',
        rows: 2,
        books: 0,
        shelfs: {
            shelfs: [
                {
                    number: 1,
                    rows: [
                        { number: 1, books: [] },
                        { number: 2, books: [] }
                    ],
                    books: []
                }
            ]
        }
    },
    {
        id: '3',
        name: 'Хранилище 3',
        description: 'Описание 3',
        rows: 2,
        books: 0,
        shelfs: {
            shelfs: [
                {
                    number: 1,
                    rows: [
                        { number: 1, books: [] },
                        { number: 2, books: [] }
                    ],
                    books: []
                }
            ]
        }
    }
]
