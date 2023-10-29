import {inject, Injectable} from "@angular/core";
import {ExplorerService} from "../../explorer/explorer.service";
import {BehaviorSubject, finalize, Observable, of, shareReplay, tap} from "rxjs";
import {TargetData} from "../../explorer/explorer.types";
import {RefInput} from "./ref-input.types";

@Injectable()
export class RefInputService {

  private static readonly cache = new Map<string, RefInput.Cache>();
  private readonly explorerService = inject(ExplorerService);

  getTarget(target: string, type: "section" | "object"): Observable<TargetData> {
    const cacheKey = `target:${target}:${type}`;
    if (!RefInputService.cache.has(cacheKey)) {
      const data$ = new BehaviorSubject<TargetData>(null);
      const request = this.explorerService.getTarget(target, type).pipe(
        tap(data => data$.next(data)),
        shareReplay(1),
        finalize(() => {
          const cached = RefInputService.cache.get(cacheKey);
          if (cached) {
            cached.data$.complete();
          }
        })
      );
      RefInputService.cache.set(cacheKey, {data$, request});
      return request;
    } else {
      const cached = RefInputService.cache.get(cacheKey)!;
      if (cached.data$.closed) {
        return of(cached.data$.value);
      } else {
        return cached.request;
      }
    }
  }
}
