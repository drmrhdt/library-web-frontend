export function getArrayFromNumber(
    number: number,
    withNumbersAsElements = false,
    startWithOne = false
): number[] {
    const array = Array.apply(null, { length: number }).map(Number.call, Number)
    if (!withNumbersAsElements) {
        return array
    }

    return array.map((el, index) => (el = startWithOne ? index + 1 : index))
}
