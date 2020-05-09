require("chromedriver");
let fs = require("fs");
let swd = require("selenium-webdriver");

let cFile = process.argv[2];
let sBookKey = process.argv[3];

let bldr = new swd.Builder();
let driver = bldr.forBrowser("chrome").build();
driver.manage().window().maximize();

(async function () {
    try {
        await driver.manage().setTimeouts({ implicit: 10000, pageLoad: 10000 })
        // login
        let data = await fs.promises.readFile(cFile);
        let { url, password, username } = JSON.parse(data);
        await driver.get(url);
        // login
        await loginHelper(username, password);
        let final_time = Date.now() + 5000;
        while (final_time >= Date.now()) { }
        // input book name
        await inputBox();
        // search and select books
        await getBooks();

    }
    catch (err) {
        console.log(err);
    }
})()

async function loginHelper(username, password) {
    // Go to login page
    // Enter userid and password
    let userFound = await driver.findElements(swd.By.css("input[type=text]"));
    let passFound = driver.findElement(swd.By.css("input[type=password]"));
    let ElementsArr = await Promise.all([userFound[1], passFound]);
    let userEntered = ElementsArr[0].sendKeys(username);
    let passEntered = ElementsArr[1].sendKeys(password);
    await Promise.all([userEntered, passEntered]);
    // Click login button
    let loginBtn = await driver.findElements(swd.By.css("button[type=submit]"));
    // console.log(loginBtn);
    await loginBtn[1].click();

}

async function inputBox() {
    await driver.manage().setTimeouts({ implicit: 10000, pageLoad: 10000 })
    // search for the search box and enter book name
    let searchBox = driver.findElement(swd.By.css("input[placeholder='Search for products, brands and more']"));
    await searchBox.sendKeys(sBookKey, swd.Key.ENTER);
}

async function getBooks() {
    // select a book
    let book = await driver.findElement(swd.By.css("div._3liAhj a"));
    let link = await book.getAttribute("href");
    await driver.get(link);
    // add to cart    
    let cartBtn = await driver.findElements(swd.By.css("button"));
    // console.log(cartBtn);
    await cartBtn[1].click();
}