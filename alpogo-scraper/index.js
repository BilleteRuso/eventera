const puppeteer = require('puppeteer');

let eventos = [];

module.exports.run = async () => {
  const browser = await puppeteer.launch({ headless: true});
  const page = await browser.newPage();
  await page.setViewport({width: 1320, height: 1080})
  await page.goto('https://alpogo.com/');
  await page.waitForSelector('div.row a#cargar-eventos')
    
  while(await page.$('div.row a#cargar-eventos') !== null) {
      await page.click('div.row a#cargar-eventos');
      await page.waitForTimeout(2000);
}
    await cargarUltimosEventos(page);
    console.log(eventos.length);

    await browser.close();  

};

    // const eventos = await page.evaluate(() =>
    //     Array.from(document.querySelectorAll('div.evento div.slide-artista a'))
    //         .map((enlace) => enlace.href));

    module.exports.getEventos = () => eventos;

    function addEventos(titulo, fecha, lugar, portada) {
        if (eventos) {
            const evento = {titulo, fecha, lugar, portada};
            eventos.push(evento)
        }
    }

    async function getPropertyValue(element, propertyName) {
        const property = await element.getProperty(propertyName);
        return await property.jsonValue();
      }

    async function cargarUltimosEventos(page) {
        eventos = [];
      
    const eventosNuevos = await page.$(".eventos");
    const nuevosRow = await eventosNuevos.$$(".evento");

    const eventosMapping = nuevosRow.map(async row => {
        const nombreEvento = await row.$("h4.nombre-artista");
        if (nombreEvento) {
            const nombreDelEvento = await getPropertyValue(nombreEvento, "innerText");
            let fechaEvento = await row.$("span.fecha");
            let fechaDelEvento = "";
            let lugarEvento = await row.$("span.lugar");
            let lugarDelEvento = "";
            // let imagen = "";
            if (fechaEvento) {
                fechaDelEvento = await getPropertyValue(fechaEvento, "innerText");
            }
            if (lugarEvento) {
                lugarDelEvento = await getPropertyValue(lugarEvento, "innerText");
            }
            let imagen = await row.$("div.slide-artista");
            let imagenes = "";
            if (imagen) {
                imagenes = await getPropertyValue(imagen, "data-original")
            }
            addEventos(nombreDelEvento, fechaDelEvento, lugarDelEvento, imagenes);
        }
    });

    await Promise.all(eventosMapping);
    }
    module.exports.run();

//     const eventos = await page.evaluate(() =>
//     Array.from(document.querySelectorAll('div.imagen')) //primero convertimos en array (imagen es el contenedor x evento)
//         .map(imagen => ({                               // de eso hacemos un map, devuelve un objeto
//             titulo: imagen.querySelector('h4.nombre-artista').innerText,
//             imagen: imagen.querySelector('div.slide-artista').dataset.original,
//             fecha: imagen.querySelector('div.fecha-lugar').innerText,
//         }))
//   )

//     console.log(eventos.length);
//     await browser.close();

// }


