import { NgModule } from '@angular/core';
import {
    MdcLinearProgressModule,
    MdcElevationModule,
    MdcSnackbarModule
} from '@angular-mdc/web';

@NgModule({
  exports: [
    MdcLinearProgressModule,
    MdcElevationModule,
    MdcSnackbarModule
  ]
})
export class AppMaterialModule { }
