const EQUALS="Equals"
const NOT_EQUALS="Not Equals"

export class CustomFilter { 
    filtername: string;
    filter : (value: any, searchValue?: any) => boolean;
}

export class FilteredValue{
    where: string;
    value: any;
    cf: CustomFilter;
}

export class FilterByString{   
    public static filters: CustomFilter[] = [{
            filtername: EQUALS,           
            filter: (value: string, searchValue: string) => {
                return value.toLowerCase() === searchValue.toLowerCase();
            }
        }, {
            filtername: NOT_EQUALS,          
            filter: (value: string, searchValue: string) => {
                return value.toLowerCase() !== searchValue.toLowerCase();
            }
        }];    
}

export class FilterByNumber{
    public static filters: CustomFilter[] =  [{
            filtername: EQUALS,            
            filter: (value: number, searchValue: number) => {
                return value === searchValue;
            }
        }, {
            filtername: NOT_EQUALS,            
            filter: (value: number, searchValue: number) => {
                return value !== searchValue;
            }
        }];
}

export class FilterByDate{
    public static filters: CustomFilter[] =  [{
            filtername: EQUALS,                        
            filter: (value: Date, searchValue: Date) => {
                return (value.getFullYear() === searchValue.getFullYear() && value.getMonth() === searchValue.getMonth() && value.getDay() === searchValue.getDay());
            }
        }, {
            filtername: NOT_EQUALS,            
            filter: (value: Date, searchValue: Date) => {
                return (value.getFullYear() !== searchValue.getFullYear() && value.getMonth() !== searchValue.getMonth() && value.getDay() !== searchValue.getDay());
            }
        }]; 
}