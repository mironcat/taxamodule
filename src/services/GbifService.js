export default class GbifService {
  getGenusNames(query) {
    return fetch(
      `//api.gbif.org/v1/species/suggest?isExtinct=true&rank=genus&q=${query}`
    )
      .then((res) => res.json())
      .then((d) => d);
  }
}
