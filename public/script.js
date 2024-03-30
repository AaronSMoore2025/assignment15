const getCrafts = async() => {
    const url = "http://localhost:3000/api/crafts";

    try {
        const response = await fetch(url);
        return response.json();
    } catch(error) {
        console.log(error);
    }
};

const showCrafts = async() => {
    const crafts = await getCrafts();
    
    crafts.forEach((craft) => {
        const section = getCraftSection(craft);
        document.getElementById("json-info").append(section);
    });
    
    //let menu = document.getElementById("json-info");
    /*
    for(let i = 0; i < crafts.length; i++){
        menu.children.item(i % 4).append(getCraftImage(crafts[i]));
    }
    */
};

const getCraftSection = (craft) => {
    const mainSection = document.createElement("section");
    mainSection.id = "mainSection";
    const img = document.createElement("img");
    img.src = "http://localhost:3000/images/" + craft.image;
    mainSection.append(img);

    mainSection.onclick = (e) => {
        console.log("i am in onclick");
        document.getElementById("dialog").style.display = "block";

        const details = document.getElementById("dialog-details");
        details.innerHTML = "";
        const imageDetails = document.getElementById("dialog-image");
        imageDetails.innerHTML = "";

        const myImage = document.createElement("img");
        myImage.src = "";
        myImage.src = "http://localhost:3000/images/" + craft.image;
        myImage.id = "myImage";
        imageDetails.append(myImage);

        const myName = document.createElement("h1");
        myName.innerHTML = craft.name;
        details.append(myName);

        const myDescription = document.createElement("p");
        myDescription.innerHTML = "Description: " + craft.description;
        details.append(myDescription);

        const mySupplies = document.createElement("p");
        mySupplies.innerHTML = "Supplies: " + craft.supplies;
        details.append(mySupplies);
    };

    document.getElementById("dialog-close").onclick = () => {
        document.getElementById("dialog").style.display = "none";
    };

    return mainSection;
};

showCrafts();