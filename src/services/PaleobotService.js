import { Directus } from '@directus/sdk';
const directus = new Directus('https://paleobot.mironcat.tk');
// 
export class DirectusItem {
    constructor({table = 'taxa', emptyfields ={
        taxonRank:'',
        genus: "",
        kingdom: "",
        phylum: "",
        family: "",
        scientificName: "",  
      }}) {
        this.item={};
        this.itemspromise=directus.items(table);
        this.emptyfields=emptyfields;
    }
    async getByID(id){
         return await this.itemspromise.readOne(id).then((t) => (this.item = t));
     }
    newEmpty(){
        this.item=this.emptyfields;
    }
    async createAndSave(){
        await this.itemspromise.createOne(this.item).then((t) => (this.item = t));
    }

    async updateOne(){
        await this.itemspromise.updateOne(this.item.id);
    }
    
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
