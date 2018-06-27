import { NgModule } from '@angular/core';
import { ItemFolderComponent } from './item-folder/item-folder';
import { IonicModule } from 'ionic-angular';
import { ItemFileComponent } from './item-file/item-file';
import { ItemCreateFolderComponent } from './item-create-folder/item-create-folder';
import { ItemCreateFileComponent } from './item-create-file/item-create-file';
import { MenuComponent } from './menu/menu';

@NgModule({
	declarations: [ItemFolderComponent, ItemFileComponent,
    ItemCreateFolderComponent,
	ItemCreateFileComponent,
	MenuComponent],
	imports: [
		IonicModule.forRoot(ItemFolderComponent),
		IonicModule.forRoot(ItemFileComponent),
		IonicModule.forRoot(MenuComponent),
	],
	exports: [ItemFolderComponent, ItemFileComponent,
    ItemCreateFolderComponent,
	ItemCreateFileComponent,
	MenuComponent]
})
export class ComponentsModule {}
