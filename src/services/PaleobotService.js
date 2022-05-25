import { Directus } from '@directus/sdk';
const directus = new Directus('https://paleobot.mironcat.tk');
// 
export class Authentication {

}
export class DirectusItem {
    constructor({table = 'taxa', emptyfields ={
        taxonRank:'',
        genus: "",
        kingdom: "",
        phylum: "",
        family: "",
        scientificName: "",
        gbifkey: null, 
      }}) {
        this.item={};
        this.itemspromise=directus.items(table);
        this.emptyfields=emptyfields;
        this.auth=false;
    }
    async authStatic(user, login){
        return await directus.auth.static('dev_token123456').then((res) => (this.auth = res));
    }
    async getByID(id){
         return await this.itemspromise.readOne(id).then((t) => this.item = t);
     }
    newEmpty(){
        this.item=this.emptyfields;
    }
    async saveToDB(){
       return await this.itemspromise.createOne(this.item);
    }

    async updateOne(){
        await this.itemspromise.updateOne(this.item.id);
    }
    
}
export class Taxon extends DirectusItem {

}

const taxa = directus.items("taxa");
export class PaleobotService {
    
    getAllTaxa(limit) {
        return taxa.readByQuery({ limit}).then(({ data }) => data);
    }
    getOneTaxaByID(id) {
        return taxa.readOne(id);
    }
}
