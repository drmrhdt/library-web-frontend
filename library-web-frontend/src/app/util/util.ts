export function getArrayFromNumber(number: number): number[] {
    return Array.apply(null, { length: number }).map(Number.call, Number)
}
