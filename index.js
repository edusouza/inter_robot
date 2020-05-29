const puppeteer = require("puppeteer");

const Firestore = require('@google-cloud/firestore');
const PROJECTID = process.env.PROJECTID;
const COLLECTION_NAME = process.env.COLLECTION_NAME;
const ACCOUNT_NUMBER = process.env.ACCOUNT_NUMBER;
const OPERATOR_NUMBER = process.env.OPERATOR_NUMBER;
const PASSWORD = process.env.PASSWORD;
const CNPJ = process.env.CNPJ;

const firestore = new Firestore({
  projectId: PROJECTID,
  timestampsInSnapshots: true,
});

const timeElapsed = (start, waitFor) => {

    return (new Date().getTime() - start) < waitFor;
}

(async () => {

    const browser = await puppeteer.launch({
        defaultViewport: {
            width: 1380,
            height: 720
        }
    });
    const page = await browser.newPage();
    await page.goto("https://bancointer.com.br");
    // await page.goto("https://bancointer.com.br", {"waitUntil": "domcontentloaded"});

    await page.screenshot({path: "inicial-01.png"});
    
    // await page.waitForResponse("https://www.bancointer.com.br/page-data/pra-voce/conta-digital/pessoa-fisica/page-data.json");

    await page.waitFor("#gatsby-focus-wrapper > header > div > div > div.header-items > div > div:nth-child(2) > a", {"timeout": 30000});

    await page.click("#gatsby-focus-wrapper > header > div > div > div.header-items > div > div > a.access-button");
    
    await page.screenshot({path: "inicial-02.png"});

    await page.focus("#account")

    const keyboard = page.keyboard;

    await keyboard.type(ACCOUNT_NUMBER);

    await page.screenshot({path: "inicial-03.png"});

    await page.click("#form > div > button");

    await page.waitForNavigation();

    await page.screenshot({path: "inicial-04.png"});

    await page.focus("#login");
    
    await keyboard.type(OPERATOR_NUMBER)

    await page.screenshot({path: "inicial-05.png"});

    await page.click("#panelPrincipal > div.grid-40.mobile-grid-50.tablet-grid-45 > input");

    await page.waitForNavigation();

    await page.screenshot({path: "inicial-06.png"});

    await page.click("#panelGeral > div.grid-50.mobile-grid-100.tablet-grid-50.topo20 > h1 > a");

    await page.waitFor("#tecladoNormal");

    await page.screenshot({path: "inicial-07.png"});

    const senha = PASSWORD;

    const caracteres = senha.split('');

    let count = 8;

    for(var i = 0; i < caracteres.length; i++) {
        const c = caracteres[i];
        await page.click(`#tecladoNormal > div > input[value='${c}']`)

        await page.waitFor(500);

        let fn = "" + count;
        fn = fn.padStart(2, "0");

        await page.screenshot({path: `inicial-${fn}.png`});
        count += 1;
    }

    await page.click("#panelTeclado > div.bgTeclado.grid-100.mobile-grid-100.tablet-grid-100.formularioLogin > div > div.grid-25.mobile-grid-30.tablet-grid-25.grid-parent > input");

    await page.waitFor('#panelToken');

    await page.screenshot({path: "inicial-16.png"});

    const cnpj = CNPJ;

    const start = new Date().getTime();

    let token = '';

    await page.waitFor(20000);

    const docCliente = await firestore.collection(COLLECTION_NAME).doc(cnpj).get()

    console.log(docCliente);

    doc = docCliente.data();

    token = doc.inter;

    console.log(token);

    await page.focus("#codigoAutorizacaoInput")

    await keyboard.type(token);

    await page.screenshot({path: "inicial-17.png"});
    
    await page.click("#confirmarCodigoTransacao")

    await page.screenshot({path: "inicial-18.png"});

    await page.waitForNavigation({'waitUntil': 'networkidle0'});
    
    await page.waitFor("#panelMenuDesktop > h1");

    await page.screenshot({path: "inicial-19.png"});

    await page.goto("https://contadigitalpro.bancointer.com.br/contacorrente/extratoContaCorrente.jsf");

    await page.screenshot({path: "inicial-20.png"});

    await page.focus("#frm > div.grid-100.mobile-grid-100.tablet-grid-100.grid-parent.bottom20 > div > div:nth-child(4) > div:nth-child(1) > span > input");

    await keyboard.type("01092019");

    await page.focus("#frm > div.grid-100.mobile-grid-100.tablet-grid-100.grid-parent.bottom20 > div > div:nth-child(4) > div:nth-child(2) > span > input");

    await keyboard.type("30092019");

    await page.screenshot({path: "inicial-21.png"});

    await page.click("#frm > div.grid-100.mobile-grid-100.tablet-grid-100.grid-parent.bottom20 > div > div:nth-child(7) > input[type=submit]");

    await page.waitFor("#j_idt173 > div.grid-100.mobile-grid-100.tablet-grid-100.grid-parent.topo20 > div:nth-child(4) > a");

    await page.screenshot({path: "inicial-22.png"});
    
    await browser.close();
})();