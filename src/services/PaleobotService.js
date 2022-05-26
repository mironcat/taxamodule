import { Directus } from '@directus/sdk';
import { ref } from "vue";
const directus = new Directus('https://paleobot.mironcat.tk');
// 
export class Authentication {

}
export class DirectusItem {
    constructor({table, emptyfields}) {
        this.itemspromise=directus.items(table);
        this.currentItem=ref(emptyfields);
        this.previousItem=ref(emptyfields);
        this.authenticated=false;
        this.emptyfields=emptyfields;
    }
    updateItem(value){
        this.currentItem.value = Object.assign({}, value);
        this.previousItem.value = Object.assign({}, value);
    }
    async authStatic(){
        this.authenticated = this.authenticated ? true : await directus.auth.static('dev_token123456');
    }
    async getByID(id){
        const res = await this.itemspromise.readOne(id);
        this.updateItem(res);
     }
    newEmpty(){
        this.item=this.emptyfields;
    }
    async saveToDB(){
        const status = false;
        const res =  await this.itemspromise.createOne(this.currentItem).then(() => this.status = true );
        this.updateItem(res);
        return status;
    }

    async updateOne(){
        const status = false;
        const id = this.currentItem.value.id;
        const value = this.currentItem.value
        const res =  await this.itemspromise.updateOne(id, value);
        return res;
    }
    
}
export class Taxon extends DirectusItem {
    constructor() {
        const emptyfields = {
            canonicalName: "test",            
            taxonRank: "",
            scientificName: "",            
            genus: "",
            kingdom: "",
            phylum: "",
            family: "",
            gbifkey: null,
          };
        super({table: 'taxa', emptyfields });
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
