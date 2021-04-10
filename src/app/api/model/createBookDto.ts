/**
 * Library
 * The library API description
 *
 * OpenAPI spec version: 1.0
 * Contact: drmrhdt@mail.ru
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface CreateBookDto { 
    /**
     * The book's name
     */
    name: string;
    /**
     * The book's author
     */
    author: string;
    /**
     * The book's description
     */
    description?: string;
    /**
     * The vault's id
     */
    vaultId: number;
    /**
     * The row where book is located
     */
    row: number;
    /**
     * The shelf where book is located
     */
    shelf: number;
    /**
     * The book's number on row
     */
    number: number;
    /**
     * Is the book missing or in place
     */
    status: CreateBookDto.StatusEnum;
    /**
     * The reason for the absence
     */
    reasonOfMissing: string;
}
export namespace CreateBookDto {
    export type StatusEnum = 'inPlace' | 'missing';
    export const StatusEnum = {
        InPlace: 'inPlace' as StatusEnum,
        Missing: 'missing' as StatusEnum
    };
}