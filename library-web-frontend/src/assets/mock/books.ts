const vault = {
    id: '1',
    numShelfs: 3,
    rows: 2,
    shelfs: [],
    books: [
        {
            id: 1,
            name: 'Name',
            author: 'Author',
            vault: 1,
            shelf: 1,
            row: 1,
            number: 1
        },
        {
            id: 2,
            name: 'Name',
            author: 'Author',
            vault: 1,
            shelf: 1,
            row: 1,
            number: 2
        },
        {
            id: 3,
            name: 'Name',
            author: 'Author',
            vault: 1,
            shelf: 1,
            row: 1,
            number: 3
        }
    ]
}

for (let curShelf = 1; curShelf <= vault.numShelfs; curShelf++) {
    const shelf = { rows: [] }
    // filter books by shelfs
    const booksOnCurShelf = vault.books.filter(book => book.shelf === curShelf)
    // filter books by rows on current shelf
    for (let curRow = 1; curRow <= vault.rows; curRow++) {
        const booksOnCurRow = booksOnCurShelf
            .filter(book => book.row === curRow)
            .sort(book => book.number) // sort by order on row
        shelf.rows.push(booksOnCurRow)
    }
    vault.shelfs.push(shelf)
}
