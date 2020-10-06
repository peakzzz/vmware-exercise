import { Injectable, PipeTransform } from '@angular/core';
import { Asset } from '../interface/asset';
import {SortColumn, SortDirection} from './sortable.directive';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';



interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

@Injectable()
export class DataService {

    assets: Asset [] = [];
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _assets$ = new BehaviorSubject<Asset[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    private _state: State = {
      page: 1,
      pageSize: 10,
      searchTerm: '',
      sortColumn: '',
      sortDirection: ''
    };
    
    constructor(){
        this.assets = this.getAllAssets(200);
    };

    get assets$() { return this._assets$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }
    get searchTerm() { return this._state.searchTerm; }

    set page(page: number) { this._set({page}); }
    set pageSize(pageSize: number) { this._set({pageSize}); }
    set searchTerm(searchTerm: string) { this._set({searchTerm}); }
    set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
    set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

    private _set(patch: Partial<State>) {
      Object.assign(this._state, patch);
      this._search$.next();
    }


    public createAsset = (assetId, assetType) => {
      let asset : Asset = {
        id : assetId,
        assetName: assetType === 'Stock' ? ['AAPL','GOOGL','FB', 'TSLA', 'MSFT'][Math.floor(Math.random() * 4)] : ['EUR','USD','GBP', 'NIS', 'AUD'][Math.floor(Math.random() * 4)],
        price: Math.random()*10,
        lastUpdate: Date.now(),
        type: assetType
      };
      return asset; 
    };
    
    public getAllAssets = (n) => {
      const result = [];
      for (let i = 0; i < n; i++) {
        result.push(this.createAsset(i, 'Stock'));
        result.push(this.createAsset(i+n, 'Currency'));
      }       
      return result;
    }

}