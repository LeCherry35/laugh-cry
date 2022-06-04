const axios = require("axios");
// const { resolveObjectURL } = require("buffer");
const cheerio = require("cheerio");
// const { dir } = require("console");
const fs = require('fs');

// const url ="https://en.wikipedia.org/wiki/The_Kinks_discography";

// let albumInfo  = getAlbumsInfo().then(data => {

//     return data;
    
// });
    
    
    


async function getAlbumReleaseDate(album) {    



        const { data } = await axios.get(album.url);          

        const $ = cheerio.load(data);

        const listItems = $(".infobox .published");           
        
        const releaseDate = listItems.text();

        return releaseDate;

    
}

async function getAlbumsInfo(subject) {
      const url ='https://en.wikipedia.org/wiki/' + subject.replaceAll(' ','_') + '_discography';
      
      console.log("URL", url);
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const listItems = $(".wikitable:first i");
console.log("$#&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", listItems);
      

      const promises = listItems.map(async function(idx, el) {

        const album = { name: "", url: "", releaseDate: ""};
       
        album.url ="https://en.wikipedia.org" +  $(el).children("a").attr("href");
        album.name =$(el).children("a").text();
       const release =  await getAlbumReleaseDate(album);
        album.releaseDate = release;

        return album;

      });

      const result = await Promise.all(promises);
      return result;

}

module.exports = getAlbumsInfo;
