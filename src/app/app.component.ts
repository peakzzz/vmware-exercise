import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { from, Observable, Subscription } from 'rxjs';
import { interval } from 'rxjs/internal/observable/interval';
import { Asset } from '../interface/asset';
import { DataService } from '../services/data.service';
import { map } from 'rxjs/operators';
import { FilteredValue, FilterByString, FilterByNumber, FilterByDate } from '../interface/customfilter';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbdSortableHeader } from '../services/sortable.directive';

const customCompare = (v1: number, v2: number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [DataService],
})
export class AppComponent implements OnInit {  
  alreadySorted: boolean = false;
  title = 'vmware-frontend-exercise';
  Assets: Asset [] = [];
  columnName: string = '';
  sortingOrder: boolean = false;
  private timeObservable = interval(1000);
  private dataSubscription: Subscription;
  
  filteredValues: FilteredValue[] = []; 
  showFilter: boolean = false;

  stringFilters = FilterByString.filters;
  numberFilters = FilterByNumber.filters;
  dateFilters = FilterByDate.filters;

  //Handling different form groups
  idForm :FormGroup;
  assetNameForm: FormGroup;
  priceForm: FormGroup;
  dateForm: FormGroup;
  assettypeForm: FormGroup;

  constructor(private dataService: DataService,
    private formBuilder: FormBuilder){  
  }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  ngOnInit(): void {    
    this.initForm();
    this.dataSubscription = this.mockObservable.subscribe();
    this.Assets = this.dataService.assets.slice();
  }

  mockObservable = Observable.create(observer => {
    this.timeObservable.subscribe(() => {
      from(this.dataService.assets).pipe(map(val => {
        const random = Math.random();
        val.price = random >= 0.5 ? val.price + random : val.price - random;
        val.lastUpdate = Date.now();      
        return val;
      }))      
      .subscribe(val => observer.next(val));
    });
  });

  initForm(){
    this.idForm = this.formBuilder.group({columnName:["id"],operation: [this.numberFilters[0].filtername],key: [null, [Validators.required]]});
    this.assetNameForm =  this.formBuilder.group({columnName:["assetName"],operation: [this.stringFilters[0].filtername],key: [null, [Validators.required]]});
    this.priceForm =  this.formBuilder.group({columnName:["price"],operation: [this.numberFilters[0].filtername],key: [null, [Validators.required]]});
    this.dateForm = this.formBuilder.group({columnName:["lastUpdate"],operation: [this.dateFilters[0].filtername],key: [null, [Validators.required]]});
    this.assettypeForm = this.formBuilder.group({columnName:["type"],operation: [this.stringFilters[0].filtername],key: [null, [Validators.required]]});
  }

  public clearFilter(){
    this.Assets = this.dataService.assets.slice();
    this.filteredValues.splice(0, this.filteredValues.length);
    this.sortingOrder = !this.sortingOrder;
    this.columnSort(this.columnName);
    this.initForm();
  }

  public filterExcl(filter:string, type:string) {
    var op = ""
    var assetParam = ""
    var key : any
    const t = filter.toLowerCase();
    switch(t){
      case "id":
          key = this.idForm.get('key').value;
          op = this.idForm.get('operation').value;
          assetParam = this.idForm.get('columnName').value;
          break;
      case "name":
          key = this.assetNameForm.get('key').value;
          op = this.assetNameForm.get('operation').value;
          assetParam = this.assetNameForm.get('columnName').value;
          break;
      case "price":
          key = this.priceForm.get('key').value;
          op = this.priceForm.get('operation').value;
          assetParam = this.priceForm.get('columnName').value;
          break;
      case "date":
          key = this.dateForm.get('key').value;
          op = this.dateForm.get('operation').value;
          assetParam = this.dateForm.get('columnName').value;
          break;
      case "type":
          key = this.assettypeForm.get('key').value;
          op = this.assettypeForm.get('operation').value;
          assetParam = this.assettypeForm.get('columnName').value; 
          break;
    }
    if(key != null) {
      this.filter(type, op, assetParam, key ); 
    }   
  }


  public filter(dataType:string, operation: string, column:string, value:any){
    const type = dataType.toLowerCase();
    switch(type){      
      case "number":
          this.filteredValues.push({where : column, value : value, cf:this.numberFilters.find(a => a.filtername === operation)});
          break;
      default:
          this.filteredValues.push({where : column, value : value, cf:this.stringFilters.find(a => a.filtername === operation)});
          break;
    }
    this.filteredValues.forEach(item => {
      if(item.value != null){
        this.Assets = this.Assets.filter( a => item.cf.filter(a[item.where], item.value));
      }      
    });
  }
  

  public columnSort (k:string) {
    if (k != null) {
      if (!this.alreadySorted){
        this.alreadySorted = true;
        this.sortingOrder = true //asc
      } else {
        this.sortingOrder = !this.sortingOrder //desc
      }
      this.Assets.sort((o1, o2) => { const cmp = customCompare(o1[k], o2[k]); return this.sortingOrder ? cmp : -cmp; });
    }
  }

  public removeSort(){
    this.Assets = this.dataService.assets.slice();
    this.filteredValues.forEach(item => {
      if(item.value != null){
        this.Assets = this.Assets.filter( a => item.cf.filter(a[item.where], item.value));
      }      
    });
    this.columnName = '';
  }
}