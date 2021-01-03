export * from './book.service';
import { BookService } from './book.service';
export * from './vault.service';
import { VaultService } from './vault.service';
export const APIS = [BookService, VaultService];
