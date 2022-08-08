import { RouterStateSnapshot } from "@angular/router";
import { RouterStateSerializer } from "@ngrx/router-store";

//24. Writing Custom Serializer
interface RouterState{
  url: string;
  queryParams: any;
  params: any;
}

export class RouterSerializer implements RouterStateSerializer<RouterState>{
  serialize(routerState: RouterStateSnapshot): RouterState {
    console.log("router serializer");

    // const {
    //   url,
    //   root: {
    //     queryParams,
    //     firstChild: { params }
    //   }
    // } = routerState;

    const url = routerState.url;
    const queryParams = routerState.root?.queryParams;
    const params = routerState.root?.firstChild?.params;
    console.log(url, queryParams, params);

    return { url, queryParams, params };
  }

}
