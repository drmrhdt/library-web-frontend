// const vault = {
//     id: '1',
//     numShelfs: 3,
//     rows: 2,
//     shelfs: [],
//     books: [
//         {
//             id: 1,
//             name: 'Name',
//             author: 'Author',
//             vault: 1, // этого нет
//             shelf: 1,
//             row: 1,
//             number: 1
// // description: "Программист-попаданец"
// // reasonOfMissing: "inPlace"
// // status: "inPlace" есть в итоге
//         },
//         {
//             id: 2,
//             name: 'Name',
//             author: 'Author',
//             vault: 1,
//             shelf: 1,
//             row: 1,
//             number: 2
//         },
//         {
//             id: 3,
//             name: 'Name',
//             author: 'Author',
//             vault: 1,
//             shelf: 1,
//             row: 1,
//             number: 3
//         }
//     ]
// }

const vaults = [
    {
        id: 1,
        name: 'vault',
        description: 'description',
        numShelfs: 3,
        numRows: 2,
        maxBooksOnShelf: 10,
        shelfs: [],
        books: [
            {
                id: 21,
                name: 'Ник',
                description: 'Программист-попаданец',
                author: 'Анджей Ясинский',
                shelf: 1,
                row: 1,
                number: 1,
                status: 'inPlace',
                reasonOfMissing: 'inPlace'
            },
            {
                id: 20,
                name: 'Ник',
                description: 'Программист-попаданец',
                author: 'Анджей Ясинский',
                shelf: 1,
                row: 1,
                number: 1,
                status: 'inPlace',
                reasonOfMissing: 'inPlace'
            },
            {
                id: 19,
                name: 'Ник',
                description: 'Программист-попаданец',
                author: 'Анджей Ясинский',
                shelf: 1,
                row: 1,
                number: 1,
                status: 'inPlace',
                reasonOfMissing: 'inPlace'
            }
        ]
    },
    {
        id: 2,
        name: 'vault',
        description: 'description',
        numShelfs: 3,
        numRows: 2,
        maxBooksOnShelf: 10,
        shelfs: [],
        books: [
            {
                id: 24,
                name: 'Ник',
                description: 'Программист-попаданец',
                author: 'Анджей Ясинский',
                shelf: 1,
                row: 1,
                number: 1,
                status: 'inPlace',
                reasonOfMissing: 'inPlace'
            },
            {
                id: 23,
                name: 'Ник',
                description: 'Программист-попаданец',
                author: 'Анджей Ясинский',
                shelf: 1,
                row: 1,
                number: 1,
                status: 'inPlace',
                reasonOfMissing: 'inPlace'
            },
            {
                id: 22,
                name: 'Ник',
                description: 'Программист-попаданец',
                author: 'Анджей Ясинский',
                shelf: 1,
                row: 1,
                number: 1,
                status: 'inPlace',
                reasonOfMissing: 'inPlace'
            }
        ]
    },
    {
        id: 3,
        name: 'vault',
        description: 'description',
        numShelfs: 3,
        numRows: 2,
        maxBooksOnShelf: 10,
        shelfs: [],
        books: []
    },
    {
        id: 4,
        name: 'vault',
        description: 'description',
        numShelfs: 3,
        numRows: 2,
        maxBooksOnShelf: 10,
        shelfs: [],
        books: []
    },
    {
        id: 5,
        name: 'vault',
        description: 'description',
        numShelfs: 3,
        numRows: 2,
        maxBooksOnShelf: 10,
        shelfs: [],
        books: []
    },
    {
        id: 6,
        name: 'vault',
        description: 'description',
        numShelfs: 3,
        numRows: 2,
        maxBooksOnShelf: 10,
        shelfs: [],
        books: []
    }
]

const filteredVaults = []

for (let curVaultNum = 0; curVaultNum < vaults.length - 1; curVaultNum++) {
    const curVault = vaults[curVaultNum]
    curVault.shelfs = []
    for (let curShelf = 1; curShelf <= curVault.numShelfs; curShelf++) {
        const shelf = { rows: [] }
        // filter books by shelfs
        const booksOnCurShelf = curVault.books.filter(
            book => book.shelf === curShelf
        )
        // filter books by rows on current shelf
        for (let curRow = 1; curRow <= curVault.numRows; curRow++) {
            const booksOnCurRow = booksOnCurShelf
                .filter(book => book.row === curRow)
                .sort(book => book.number) // sort by order on row
            shelf.rows.push(booksOnCurRow)
        }
        curVault.shelfs.push(shelf)
    }
    filteredVaults.push(curVault)
}

console.log(filteredVaults)
