import { Directive, OnDestroy, OnInit } from '@angular/core';
import { App } from 'ionic-angular';

/**
 * Generated class for the ToasterMoveFabDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[toaster-move-fab]' // Attribute selector
})
export class ToasterMoveFabDirective implements OnInit, OnDestroy {

  private ionAppElem: any;
  private observer: MutationObserver;

  constructor(private app: App) {
  }

  ngOnInit() {
    this.ionAppElem = document.querySelector('.app-root');
    this.observer = new MutationObserver(this.mutationCallback);
    this.observer.observe(this.ionAppElem, { childList: true });
    this.app.viewDidEnter.subscribe(() => {
      console.log("ToasterMoveFabDirective");
      this.moveFixedContentsUp(this.getToastElem(), true);
    });
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }

  private getToastElem() {
    return document.querySelector('.toast-wrapper.toast-bottom');
  }

  private mutationCallback = mutationsList => {
    for (const mutation of mutationsList) {
      const toastElem = this.getToastElem();
      if (mutation.type == 'childList' && toastElem) {
        this.moveFixedContentsUp(toastElem);
        this.setToastObserver(toastElem);
      }
    }
  };

  private restoreFixedContents(toastBottomWrapperElem: any) {
    const fixedContents = this.getFixedContents();
    for (const fixed of fixedContents) {
      const marginBottom = parseInt(fixed.style.marginBottom);
      fixed.style.transition = 'margin-bottom 400ms';
      fixed.style.marginBottom = `${marginBottom -
        toastBottomWrapperElem.offsetHeight}px`;
      const timeout = setTimeout(() => {
        fixed && (fixed.style.transition = 'initial');
        clearTimeout(timeout);
      }, 15000);
      fixed.removeAttribute('moved-by-toast');
    }
  }

  private setToastObserver(toastBottomElem: any) {
    const toastObserver = new MutationObserver(mutationsList => {
      if (toastBottomElem.style.transform === 'translateY(100%)') {
        this.restoreFixedContents(toastBottomElem);
        toastObserver.disconnect();
      }
    });
    toastObserver.observe(toastBottomElem, {
      attributes: true
    });
  }

  private getFixedContents(onlyUntouched?: boolean) {
    const result = onlyUntouched
      ? document.querySelectorAll(
          '.fixed-content:not([moved-by-toast=true])'
        )
      : document.querySelectorAll('.fixed-content');
    return [].slice.call(result);
  }

  private moveFixedContentsUp(toastBottomElem: any, onlyUntouched?: boolean) {
    if (!toastBottomElem) return;
    const fixedContents = this.getFixedContents(onlyUntouched);
    let marginBottom;
    for (const fixed of fixedContents) {
      if (!onlyUntouched) {
        fixed.setAttribute('moved-by-toast', true);
        marginBottom = parseInt(window.getComputedStyle(fixed).marginBottom);
        fixed.style.transition = 'margin-bottom 400ms';
        fixed.style.marginBottom = `${marginBottom + toastBottomElem.offsetHeight}px`;
        console.log(fixed);
      }
    }
  }
}