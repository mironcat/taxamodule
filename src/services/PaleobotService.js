import { Directus } from '@directus/sdk';
import { ref } from "vue";
const directus = new Directus('https://paleobot.mironcat.tk');
// 
export class DirectusItem {
    constructor({table, emptyfields}) {
        this.itemspromise=directus.items(table);
        this.currentItem=ref(emptyfields);
        this.previousItem=ref(emptyfields);
        this.authenticated=false;
        this.emptyfields=emptyfields;
    }
    setItemValue(value){
        this.currentItem.value = Object.assign({}, value);
        this.previousItem.value = Object.assign({}, value);
    }       
    async authStatic(){
        this.authenticated = this.authenticated ? true : await directus.auth.static('dev_token123456');
    }    

    async getByID(id){
        const ItemValue = await this.itemspromise.readOne(id);
        this.setItemValue(ItemValue);
     }
    async createOne(){
        const status = false;
        const newItemValue =  await this.itemspromise.createOne(this.currentItem.value);
        this.setItemValue(newItemValue);
        return newItemValue;
    }
    async deleteOne(){
        return await this.itemspromise.deleteOne(this.currentItem.value.id);
    }
    async updateOne(){
        const id = this.currentItem.value.id;
        const value =Object.assign({}, this.currentItem.value); 
        delete value.id;
        const ItemValue =  await this.itemspromise.updateOne(id, value);
        this.setItemValue(ItemValue);
        return ItemValue;
    }
    async readByQuery(limit) {
        return await this.itemspromise.readByQuery({ limit });
    }
    
}
export class Taxon extends DirectusItem {
    constructor() {
        const emptyfields = {
            canonicalName: "",            
            taxonRank: "",
            scientificName: "",            
            genus: "",
            kingdom: "",
            phylum: "",
            family: "",
            gbifkey: null,
          };
        super({table: 'taxa', emptyfields });
        this.selectedgbiftaxon=ref(emptyfields);
        this.listofgbiftaxons=ref();
    }
    async searchTaxonByGbif({taxname, getfirst = false}) {
        const response = await fetch(`//api.gbif.org/v1/species/suggest?q=${taxname.trim()}`);
        const data = await response.json();
        if (getfirst) this.selectedgbiftaxon.value = data[0];
        this.listofgbiftaxons.value=data;
      }
    getForrmattedGbifTaxon(){
        const {
            key,
            rank,
            genus,
            family,
            phylum,
            kingdom,
            scientificName,
            canonicalName,
          } = this.selectedgbiftaxon.value;
          const gbifTempTaxon = {
            canonicalName,
            taxonRank: rank,
            scientificName,
            genus,
            family,
            phylum,
            kingdom,
            gbifkey: key,
          };
          const id = this.currentItem.value.id;
          if (id) gbifTempTaxon.id=id
          return gbifTempTaxon;
    }
    setGbifToCurrent(){
        this.currentItem.value = this.getForrmattedGbifTaxon()
    }
    setOnlyHighTaxonomy(){
        this.currentItem.value.kingdom = this.selectedgbiftaxon.value.kingdom;
        this.currentItem.value.phylum = this.selectedgbiftaxon.value.phylum;
        this.currentItem.value.family = this.selectedgbiftaxon.value.family;
    }
}

const taxa = directus.items("taxa");
export class PaleobotService {
    async authStatic(){
        this.authenticated = this.authenticated ? true : await directus.auth.static('dev_token123456');
    }
    async getAllTaxa(limit) {
        return await taxa.readByQuery({ limit }).then(({ data }) => data);
    }
    async getOneTaxaByID(id) {
        return await taxa.readOne(id);
    }
}
