const row = document.querySelector(".row");
const userInput = document.querySelector("#breed");

userInput.addEventListener("input", search);
const dogDesc = async (breedName) => {
  //Wiki API
  let wikiUrl = "https://en.wikipedia.org/w/api.php";
  const params = {
    origin: "*",
    format: "json",
    action: "query",
    prop: "extracts",
    exsentences: 1,
    exintro: false,
    explaintext: true,
    generator: "search",
    gsrlimit: 1,
  };
  params.gsrsearch = breedName;
  let { data } = await axios.get(wikiUrl, { params });

  //console.log(data);
  let desc = data.query.pages;

  let pageID = parseInt(Object.getOwnPropertyNames(desc));
  let para = document.createElement("p");
  para.innerHTML = desc[pageID].extract;
  return para;
};

function search(event) {
  event.preventDefault();
  let breedName = userInput.value;
  createAllCards(breedName);
  //call create all cards.
}

const capitalizeFirst = (toCapitalize) => {
  return toCapitalize[0].toUpperCase() + toCapitalize.slice(1);
};

const finalizeName = (breedName) => {
  return tryAddDogSuffix(fixName(breedName));
};

const tryAddDogSuffix = (breedName) => {
  str = breedName.toLowerCase();
  if (str.includes("hound") || str.includes("hund") || str.includes("dog"))
    return breedName;
  else return breedName + " Dog";
};

const fixName = (breedName) => {
  switch (breedName) {
    case "Shepherd Australian":
      breedName = "Australian Shepherd";
      break;
    case "Lapphund Finnish":
      breedName = "Finnish Lapphund";
      break;
    case "Mix":
      breedName = "Mixed";
      break;
    default:
      break;
  }
  return breedName;
};

//creates a card as dog breed is being searched
const createCard = (url, breedName, breedInfo) => {
  let cardSize = document.createElement("div");
  let card = document.createElement("div");
  let image = document.createElement("img");
  let cardBody = document.createElement("div");
  let cardTitle = document.createElement("h3");
  //  let dogInfo = document.createElement("p");
  cardSize.setAttribute("class", "col-xs-12 col-sm-6 col-lg-4");
  card.setAttribute("class", "card");
  image.setAttribute("src", `${url}`);
  image.setAttribute("class", "card-img-top");
  switch (breedName[0]) {
    case "A" || "E" || "I" || "O" || "U":
      image.setAttribute("alt", `An ${breedName}`);
      break;
    default:
      image.setAttribute("alt", `A ${breedName}`);
      break;
  }
  cardBody.setAttribute("class", "card-body");
  cardTitle.setAttribute("class", "card-title");

  cardTitle.innerHTML = `${breedName}`;
  //dogInfo.innerHTML = `${breedInfo}`;
  cardBody.append(cardTitle);
  cardBody.append(breedInfo);
  card.append(image);
  card.append(cardBody);
  cardSize.append(card);

  return cardSize;
};

const createAllCards = async (input) => {
  const allBreedsResponse = await fetch("https://dog.ceo/api/breeds/list/all");
  const allBreedsObj = (await allBreedsResponse.json()).message;
  const breedNames = [];
  const breedImgsSrcs = [];
  const subBreeds = [];
  console.log(allBreedsObj);
  for (breed in allBreedsObj) {
    let breedName = capitalizeFirst(breed);

    let breedImg = "https://dog.ceo/api/breed/";
    //  console.log(allBreedsObj);
    if (allBreedsObj[breed].length == 0) {
      breedName = finalizeName(breedName);
      breedImg = breedImg + breed + "/images/random";
      breedNames.push(breedName);
      breedImgsSrcs.push(breedImg);
    } else {
      // if the breed has sub-breeds
      // traverse the sub-breeds and add them to the list
      for (let i = 0; i < allBreedsObj[breed].length; ++i) {
        let subbreeds = {};
        const subBreed = allBreedsObj[breed][i];
        breedName = capitalizeFirst(subBreed) + " " + capitalizeFirst(breed);
        breedName = finalizeName(breedName);
        breedImg =
          "https://dog.ceo/api/breed/" +
          breed +
          "/" +
          allBreedsObj[breed][i] +
          "/images/random";
        //breedNames.push(breedName);
        //breedImgsSrcs.push(breedImg);
        subbreeds.breed = capitalizeFirst(breed);
        subbreeds.sub = breedName;
        subbreeds.images = breedImg;

        subBreeds.push(subbreeds);
      }
    }
  }
  console.log(subBreeds);
  const searchBreedNames = breedNames.filter(
    (element) => element === `${input}`
  );
  input = input.split(" ");
  const searchImgBreed = breedImgsSrcs.filter(
    (element) =>
      element ===
      `${`https://dog.ceo/api/breed/${input[0].toLowerCase()}/images/random`}`
  );
  // searchImgBreed.forEach((element) => console.log(element));
  for (let i = 0; i < searchBreedNames.length; ++i) {
    const breedName = searchBreedNames[i];
    const breedImage = (await (await fetch(searchImgBreed[i])).json()).message;
    const breedInfo = await dogDesc(breedName);
    const card = createCard(breedImage, breedName, breedInfo);
    row.append(card);
  }
};
