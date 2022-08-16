let jsonFile = require('./testAttractionListData.json')

jsonFile.data.forEach(e => {
    if (e.subcategory===undefined) {
        console.log(e)
    }
});
//console.log(jsonFile.data[0].subcategory[0].name)
