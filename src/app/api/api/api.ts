export * from './book.service';
import { BookService } from './book.service';
export * from './default.service';
import { DefaultService } from './default.service';
export * from './tags.service';
import { TagsService } from './tags.service';
export * from './vault.service';
import { VaultService } from './vault.service';
export const APIS = [BookService, DefaultService, TagsService, VaultService];
