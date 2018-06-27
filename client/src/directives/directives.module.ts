import { NgModule } from '@angular/core';
import { AuthenticatedGatekeeperDirective } from './authentication-gatekeeper/authenticated-gatekeeper';
import { UnauthenticatedGatekeeperDirective } from './authentication-gatekeeper/unauthenticated-gatekeeper';
import { HideFabDirective } from './hide-fab/hide-fab';
import { ToasterMoveFabDirective } from './toaster-move-fab/toaster-move-fab';

@NgModule({
	declarations: [
		AuthenticatedGatekeeperDirective, 
		UnauthenticatedGatekeeperDirective,
		HideFabDirective,
    	ToasterMoveFabDirective
	],
	imports: [
	],
	exports: [
		AuthenticatedGatekeeperDirective, 
		UnauthenticatedGatekeeperDirective,
		HideFabDirective,
    	ToasterMoveFabDirective
	]
})
export class DirectivesModule {}
