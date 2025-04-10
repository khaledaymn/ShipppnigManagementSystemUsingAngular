import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class SidebarService {
  private isCollapsedSubject = new BehaviorSubject<boolean>(false)
  public isCollapsed$ = this.isCollapsedSubject.asObservable()

  toggleSidebar(): void {
    this.isCollapsedSubject.next(!this.isCollapsedSubject.value)
  }

  setSidebarState(isCollapsed: boolean): void {
    this.isCollapsedSubject.next(isCollapsed)
  }
}
