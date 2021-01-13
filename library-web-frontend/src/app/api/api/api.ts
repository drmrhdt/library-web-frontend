export * from './book.service';
import { BookService } from './book.service';
export * from './tags.service';
import { TagsService } from './tags.service';
export * from './vault.service';
import { VaultService } from './vault.service';
export const APIS = [BookService, TagsService, VaultService];
