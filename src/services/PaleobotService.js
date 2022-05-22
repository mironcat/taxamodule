import { Directus } from '@directus/sdk';
const directus = new Directus('https://paleobot.mironcat.tk');
const taxa = directus.items("taxa");
export default class PaleobotService {
    getAllTaxa(limit) {
        return taxa.readByQuery({ limit}).then(({ data }) => data);
    }
    getOneTaxaByID(id) {
        return taxa.readOne(id);
    }
}
